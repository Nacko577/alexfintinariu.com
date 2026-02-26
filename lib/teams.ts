// Teams Data Management
// This file handles fetching and displaying team data

export interface TeamData {
  record: string;
  standing: string;
  lastResult: string;
  nextFixture: string;
  points?: string; // Optional points field for leagues that use points
  winRate?: number; // Win percentage (0-100)
  trend?: 'up' | 'down' | 'neutral'; // Recent form trend
}

// Manchester United (Premier League)
export async function loadManchesterUnited(): Promise<TeamData> {
  try {
    // Call our API route (server-side proxy on Vercel)
    const response = await fetch(`/api/teams/manutd?t=${Date.now()}`, { cache: 'no-store' });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API route error:', response.status, errorData);
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    const matches = data.matches?.matches || [];
    const standingsData = data.standings;

    const finished = matches
      .filter((m: any) => m.status === 'FINISHED')
      .sort((a: any, b: any) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime());

    const upcoming = matches
      .filter((m: any) => m.status === 'SCHEDULED' || m.status === 'TIMED')
      .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

    const lastMatch = finished[0];
    const nextMatch = upcoming[0];

    const lastResult = lastMatch
      ? `${lastMatch.homeTeam.name} ${lastMatch.score.fullTime.home}-${lastMatch.score.fullTime.away} ${lastMatch.awayTeam.name}`
      : 'No recent result';

    const nextFixture = nextMatch
      ? `vs ${nextMatch.awayTeam.id === 66 ? nextMatch.homeTeam.name : nextMatch.awayTeam.name} (${new Date(nextMatch.utcDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})`
      : 'No upcoming match';

    let standing = 'N/A';
    let record = 'N/A';
    let points: string | undefined;

    if (standingsData) {
      const teamStanding = standingsData.standings?.[0]?.table?.find((t: any) => t.team.id === 66);
      if (teamStanding) {
        standing = `${teamStanding.position}${getOrdinalSuffix(teamStanding.position)} Place`;
        record = `${teamStanding.won}-${teamStanding.draw}-${teamStanding.lost}`;
        points = teamStanding.points?.toString() || undefined;
      }
    }

    // Calculate win rate and trend for Man Utd
    let winRate: number | undefined;
    let trend: 'up' | 'down' | 'neutral' | undefined;

    if (standingsData) {
      const teamStanding2 = standingsData.standings?.[0]?.table?.find((t: any) => t.team.id === 66);
      if (teamStanding2) {
        const totalGames = teamStanding2.won + teamStanding2.draw + teamStanding2.lost;
        if (totalGames > 0) {
          winRate = Math.round((teamStanding2.won / totalGames) * 100);
        }
      }
    }

    // Determine trend from last match
    if (lastMatch) {
      const homeScore = lastMatch.score.fullTime.home;
      const awayScore = lastMatch.score.fullTime.away;
      const isHome = lastMatch.homeTeam.id === 66;
      if (homeScore === awayScore) {
        trend = 'neutral';
      } else if ((isHome && homeScore > awayScore) || (!isHome && awayScore > homeScore)) {
        trend = 'up';
      } else {
        trend = 'down';
      }
    }

    return {
      record,
      standing,
      lastResult,
      nextFixture,
      points,
      winRate,
      trend,
    };
  } catch (error: any) {
    console.error('❌ Error loading Manchester United data:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
    
    // Throw error instead of returning mock data so the UI can show an error state
    throw error;
  }
}

// Baltimore Orioles (MLB)
export async function loadBaltimoreOrioles(): Promise<TeamData> {
  const response = await fetch(`/api/teams/orioles?t=${Date.now()}`, { cache: "no-store" });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `API error: ${response.status}`);
  }

  const data = await response.json();
  const last = data.lastGame;
  const next = data.nextGame;

  const lastResult = last
    ? `${last.awayTeam} ${last.awayScore}-${last.homeScore} ${last.homeTeam}`
    : "No recent result";

  const nextFixture = next
    ? (() => {
        const dt = new Date(next.date);
        const dateStr = dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        const opponent = next.homeAbbr === "BAL" ? next.awayTeam : next.homeTeam;
        return `vs ${opponent} (${dateStr})`;
      })()
    : "No upcoming game";

  const standing =
    data.divisionRank != null && data.groupName
      ? `${data.divisionRank}${getOrdinalSuffix(Number(data.divisionRank))} in ${data.groupName}`
      : "N/A";

  // Calculate win rate and trend
  let winRate: number | undefined;
  let trend: 'up' | 'down' | 'neutral' | undefined;

  if (data.record && data.record !== 'N/A') {
    const parts = data.record.split('-').map(Number);
    if (parts.length >= 2) {
      const wins = parts[0];
      const losses = parts[1];
      const total = wins + losses;
      if (total > 0) winRate = Math.round((wins / total) * 100);
    }
  }

  if (last) {
    const homeWon = last.homeScore > last.awayScore;
    const isHome = last.homeAbbr === 'BAL';
    if (last.homeScore === last.awayScore) {
      trend = 'neutral';
    } else if ((isHome && homeWon) || (!isHome && !homeWon)) {
      trend = 'up';
    } else {
      trend = 'down';
    }
  }

  return {
    record: data.record ?? "N/A",
    standing,
    lastResult,
    nextFixture,
    winRate,
    trend,
  };
}

// Baltimore Ravens (NFL)
export async function loadBaltimoreRavens(): Promise<TeamData> {
  const response = await fetch(`/api/teams/ravens?t=${Date.now()}`, { cache: "no-store" });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `API error: ${response.status}`);
  }

  const data = await response.json();
  const last = data.lastGame;
  const next = data.nextGame;

  const lastResult = last
    ? `${last.awayTeam} ${last.awayScore}-${last.homeScore} ${last.homeTeam}`
    : "No recent result";

  const nextFixture = next
    ? (() => {
        const dt = new Date(next.date);
        const dateStr = dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        const opponent = next.homeAbbr === "BAL" ? next.awayTeam : next.homeTeam;
        return `vs ${opponent} (${dateStr})`;
      })()
    : "No upcoming game";

  const standing =
    data.divisionRank != null && data.groupName
      ? `${data.divisionRank}${getOrdinalSuffix(Number(data.divisionRank))} in ${data.groupName}`
      : "N/A";

  // Calculate win rate and trend
  let winRate: number | undefined;
  let trend: 'up' | 'down' | 'neutral' | undefined;

  if (data.record && data.record !== 'N/A') {
    const parts = data.record.split('-').map(Number);
    if (parts.length >= 2) {
      const wins = parts[0];
      const losses = parts[1];
      const total = wins + losses;
      if (total > 0) winRate = Math.round((wins / total) * 100);
    }
  }

  if (last) {
    const homeWon = last.homeScore > last.awayScore;
    const isHome = last.homeAbbr === 'BAL';
    if (last.homeScore === last.awayScore) {
      trend = 'neutral';
    } else if ((isHome && homeWon) || (!isHome && !homeWon)) {
      trend = 'up';
    } else {
      trend = 'down';
    }
  }

  return {
    record: data.record ?? "N/A",
    standing,
    lastResult,
    nextFixture,
    winRate,
    trend,
  };
}

// LA Lakers (NBA)
export async function loadLakers(): Promise<TeamData> {
  const response = await fetch(`/api/teams/lakers?t=${Date.now()}`, { cache: "no-store" });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `API error: ${response.status}`);
  }

  const data = await response.json();

  const last = data.lastGame;
  const next = data.nextGame;

  const lastResult = last
    ? `${last.awayTeam} ${last.awayScore}-${last.homeScore} ${last.homeTeam}`
    : "No recent result";

  const nextFixture = next
    ? (() => {
        const dt = new Date(next.date);
        const dateStr = dt.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const opponent = next.homeAbbr === "LAL" ? next.awayTeam : next.homeTeam;
        return `vs ${opponent} (${dateStr})`;
      })()
    : "No upcoming match";

  const standing =
    data.confRank != null ? `${data.confRank}${getOrdinalSuffix(Number(data.confRank))} in West` : "N/A";

  // Calculate win rate and trend
  let winRate: number | undefined;
  let trend: 'up' | 'down' | 'neutral' | undefined;

  if (data.record && data.record !== 'N/A') {
    const parts = data.record.split('-').map(Number);
    if (parts.length >= 2) {
      const wins = parts[0];
      const losses = parts[1];
      const total = wins + losses;
      if (total > 0) winRate = Math.round((wins / total) * 100);
    }
  }

  if (last) {
    const homeWon = last.homeScore > last.awayScore;
    const isHome = last.homeAbbr === 'LAL';
    if (last.homeScore === last.awayScore) {
      trend = 'neutral';
    } else if ((isHome && homeWon) || (!isHome && !homeWon)) {
      trend = 'up';
    } else {
      trend = 'down';
    }
  }

  return {
    record: data.record ?? "N/A",
    standing,
    lastResult,
    nextFixture,
    winRate,
    trend,
  };
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}
