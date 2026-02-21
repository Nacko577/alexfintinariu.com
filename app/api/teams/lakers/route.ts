import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ESPN endpoints (unofficial but free)
const ESPN_SITE = "https://site.api.espn.com/apis/site/v2";
const ESPN_WEB = "https://site.web.api.espn.com/apis/v2";

const LAKERS_ABBR = "LAL";

function fmtYYYYMMDD(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function isLakersInEvent(ev: any) {
  const competitors = ev?.competitions?.[0]?.competitors ?? [];
  return competitors.some((c: any) => c?.team?.abbreviation === LAKERS_ABBR);
}

function parseEvent(ev: any) {
  const comp = ev?.competitions?.[0];
  const competitors = comp?.competitors ?? [];

  const home = competitors.find((c: any) => c?.homeAway === "home");
  const away = competitors.find((c: any) => c?.homeAway === "away");

  const statusType = comp?.status?.type ?? {};
  const state = statusType?.state; // "pre" | "in" | "post"
  const detail = statusType?.detail ?? ""; // "Final", "7:30 PM ET", etc.

  const dateIso = ev?.date ?? comp?.date; // ISO string

  return {
    id: ev?.id,
    date: dateIso,
    state,
    detail,
    homeTeam: home?.team?.displayName,
    awayTeam: away?.team?.displayName,
    homeAbbr: home?.team?.abbreviation,
    awayAbbr: away?.team?.abbreviation,
    homeScore: home?.score != null ? Number(home.score) : null,
    awayScore: away?.score != null ? Number(away.score) : null,
  };
}

// Traverse ESPN standings tree to find the Lakers entry
function findTeamInStandings(node: any, teamAbbr: string): any | null {
  if (!node) return null;

  // Some levels have "standings.entries"
  const entries = node?.standings?.entries;
  if (Array.isArray(entries)) {
    const found = entries.find((e: any) => e?.team?.abbreviation === teamAbbr);
    if (found) return found;
  }

  // Many levels have children
  const kids = node?.children;
  if (Array.isArray(kids)) {
    for (const k of kids) {
      const r = findTeamInStandings(k, teamAbbr);
      if (r) return r;
    }
  }

  return null;
}

function statValue(entry: any, name: string): string | null {
  const stats: any[] = entry?.stats ?? [];
  const s = stats.find((x) => x?.name === name);
  if (!s) return null;
  return s.displayValue ?? s.value?.toString?.() ?? null;
}

export async function GET() {
  try {
    // 1) Standings
    // type=0 level=0 is a commonly used “overall” view.
    const standingsUrl = `${ESPN_WEB}/sports/basketball/nba/standings?type=0&level=0`;

    // 2) Scoreboard for a date range around "today" to get last+next
    // (range makes it robust even if Lakers didn’t play today)
    const today = new Date();
    const from = fmtYYYYMMDD(addDays(today, -14));
    const to = fmtYYYYMMDD(addDays(today, 14));
    const scoreboardUrl = `${ESPN_SITE}/sports/basketball/nba/scoreboard?dates=${from}-${to}&limit=500`;

    const [standingsRes, scoreboardRes] = await Promise.all([
      fetch(standingsUrl, { cache: "no-store" }),
      fetch(scoreboardUrl, { cache: "no-store" }),
    ]);

    if (!standingsRes.ok) {
      const t = await standingsRes.text();
      return NextResponse.json(
        { error: `ESPN standings error: ${standingsRes.status} - ${t}` },
        { status: standingsRes.status }
      );
    }

    if (!scoreboardRes.ok) {
      const t = await scoreboardRes.text();
      return NextResponse.json(
        { error: `ESPN scoreboard error: ${scoreboardRes.status} - ${t}` },
        { status: scoreboardRes.status }
      );
    }

    const standingsJson = await standingsRes.json();
    const scoreboardJson = await scoreboardRes.json();

    const lakersEntry = findTeamInStandings(standingsJson, LAKERS_ABBR);

    const wins = lakersEntry ? statValue(lakersEntry, "wins") : null;
    const losses = lakersEntry ? statValue(lakersEntry, "losses") : null;

    // ESPN standings sometimes has different “rank” stats depending on view.
    const confRank =
      (lakersEntry && (statValue(lakersEntry, "conferenceRank") || statValue(lakersEntry, "playoffSeed"))) ||
      null;

    const record = wins && losses ? `${wins}-${losses}` : "N/A";

    // 3) Find Lakers games in the scoreboard events and pick last/next
    const events: any[] = scoreboardJson?.events ?? [];
    const lakersEvents = events.filter(isLakersInEvent).map(parseEvent);

    const now = Date.now();

    const past = lakersEvents
      .filter((e) => e?.date && new Date(e.date).getTime() <= now && e.state === "post")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const future = lakersEvents
      .filter((e) => e?.date && new Date(e.date).getTime() > now && (e.state === "pre" || e.state === "in"))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const lastGame = past[0] ?? null;
    const nextGame = future[0] ?? null;

    const res = NextResponse.json({
      record,
      confRank,
      lastGame,
      nextGame,
      raw: {
        standings: standingsJson,
        scoreboard: scoreboardJson,
      },
    });

    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to fetch Lakers data" },
      { status: 500 }
    );
  }
}