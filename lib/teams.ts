// Teams Data Management
// This file handles fetching and displaying team data

export interface TeamData {
  record: string;
  standing: string;
  lastResult: string;
  nextFixture: string;
  points?: string; // Optional points field for leagues that use points
}

// Manchester United (Premier League)
export async function loadManchesterUnited(): Promise<TeamData> {
  try {
    // Call our API route (server-side proxy on Vercel)
    console.log('Fetching Manchester United data from API route...');
    const response = await fetch('/api/teams/manutd');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API route error:', response.status, errorData);
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response received:', data);
    const matches = data.matches?.matches || [];
    const standingsData = data.standings;
    
    if (!matches || matches.length === 0) {
      console.warn('No matches found in API response');
    }

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

    return {
      record,
      standing,
      lastResult,
      nextFixture,
      points,
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
  // Mock data - replace with actual API call when MLB API key is available
  return {
    record: '87-54',
    standing: '1st in AL East',
    lastResult: 'Orioles 5-3 Yankees',
    nextFixture: 'vs Red Sox (Fri, 7:05 PM)',
  };
}

// Baltimore Ravens (NFL)
export async function loadBaltimoreRavens(): Promise<TeamData> {
  // Mock data - replace with actual API call when NFL API key is available
  return {
    record: '11-4',
    standing: '1st in AFC North',
    lastResult: 'Ravens 33-19 49ers',
    nextFixture: 'vs Dolphins (Sun, 1:00 PM)',
  };
}

// LA Lakers (NBA)
export async function loadLakers(): Promise<TeamData> {
  // Mock data - replace with actual API call when NBA API key is available
  return {
    record: '24-19',
    standing: '8th in West',
    lastResult: 'Lakers 112-105 Thunder',
    nextFixture: 'vs Celtics (Mon, 7:30 PM)',
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
