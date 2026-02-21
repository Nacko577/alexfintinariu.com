import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ESPN_SITE = "https://site.api.espn.com/apis/site/v2";
const ESPN_WEB = "https://site.web.api.espn.com/apis/v2";

const TEAM_ABBR = "BAL"; // Orioles
const SPORT = "baseball";
const LEAGUE = "mlb";

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

function isTeamInEvent(ev: any) {
  const competitors = ev?.competitions?.[0]?.competitors ?? [];
  return competitors.some((c: any) => c?.team?.abbreviation === TEAM_ABBR);
}

function parseEvent(ev: any) {
  const comp = ev?.competitions?.[0];
  const competitors = comp?.competitors ?? [];

  const home = competitors.find((c: any) => c?.homeAway === "home");
  const away = competitors.find((c: any) => c?.homeAway === "away");

  const statusType = comp?.status?.type ?? {};
  const state = statusType?.state; // "pre" | "in" | "post"
  const detail = statusType?.detail ?? "";

  const dateIso = ev?.date ?? comp?.date;

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

function statValue(entry: any, name: string): string | null {
  const stats: any[] = entry?.stats ?? [];
  const s = stats.find((x) => x?.name === name);
  return s?.displayValue ?? (s?.value != null ? String(s.value) : null);
}

function findTeamInStandings(node: any, teamAbbr: string, currentGroup?: string): { entry: any; groupName?: string } | null {
  if (!node) return null;

  const groupName = node?.name ?? currentGroup;

  const entries = node?.standings?.entries;
  if (Array.isArray(entries)) {
    const found = entries.find((e: any) => e?.team?.abbreviation === teamAbbr);
    if (found) return { entry: found, groupName };
  }

  const kids = node?.children;
  if (Array.isArray(kids)) {
    for (const k of kids) {
      const r = findTeamInStandings(k, teamAbbr, groupName);
      if (r) return r;
    }
  }

  return null;
}

export async function GET() {
  try {
    const standingsUrl = `${ESPN_WEB}/sports/${SPORT}/${LEAGUE}/standings?level=3`;

    const today = new Date();
    const from = fmtYYYYMMDD(addDays(today, -30));
    const to = fmtYYYYMMDD(addDays(today, 30));
    const scoreboardUrl = `${ESPN_SITE}/sports/${SPORT}/${LEAGUE}/scoreboard?dates=${from}-${to}&limit=500`;

    const [standingsRes, scoreboardRes] = await Promise.all([
      fetch(standingsUrl, { cache: "no-store" }),
      fetch(scoreboardUrl, { cache: "no-store" }),
    ]);

    if (!standingsRes.ok) {
      const t = await standingsRes.text();
      return NextResponse.json({ error: `ESPN standings error: ${standingsRes.status} - ${t}` }, { status: standingsRes.status });
    }
    if (!scoreboardRes.ok) {
      const t = await scoreboardRes.text();
      return NextResponse.json({ error: `ESPN scoreboard error: ${scoreboardRes.status} - ${t}` }, { status: scoreboardRes.status });
    }

    const standingsJson = await standingsRes.json();
    const scoreboardJson = await scoreboardRes.json();

    const found = findTeamInStandings(standingsJson, TEAM_ABBR);
    const entry = found?.entry ?? null;
    const groupName = found?.groupName ?? null; // often "AL East"

    const wins = entry ? statValue(entry, "wins") : null;
    const losses = entry ? statValue(entry, "losses") : null;
    const divisionRank = entry ? (statValue(entry, "divisionRank") ?? statValue(entry, "playoffSeed")) : null;

    const record = wins && losses ? `${wins}-${losses}` : "N/A";

    const events: any[] = scoreboardJson?.events ?? [];
    const teamEvents = events.filter(isTeamInEvent).map(parseEvent);

    const now = Date.now();

    const past = teamEvents
      .filter((e) => e?.date && new Date(e.date).getTime() <= now && e.state === "post")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const future = teamEvents
      .filter((e) => e?.date && new Date(e.date).getTime() > now && (e.state === "pre" || e.state === "in"))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const lastGame = past[0] ?? null;
    const nextGame = future[0] ?? null;

    const res = NextResponse.json({
      record,
      divisionRank,
      groupName,
      lastGame,
      nextGame,
      raw: { standings: standingsJson, scoreboard: scoreboardJson },
    });

    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to fetch Orioles data" }, { status: 500 });
  }
}