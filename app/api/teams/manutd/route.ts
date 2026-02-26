import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    console.error('❌ FOOTBALL_API_KEY not configured in environment variables');
    return NextResponse.json(
      { error: 'FOOTBALL_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const [matchesRes, standingsRes] = await Promise.all([
      fetch('https://api.football-data.org/v4/teams/66/matches?competitions=PL&limit=38', {
        headers: {
          'X-Auth-Token': apiKey,
        },
      }),
      fetch('https://api.football-data.org/v4/competitions/PL/standings?season=2025', {
        headers: {
          'X-Auth-Token': apiKey,
        },
      }),
    ]);

    if (!matchesRes.ok) {
      const errorText = await matchesRes.text();
      console.error('❌ Matches API error:', matchesRes.status, errorText);
      return NextResponse.json(
        { error: `Matches API error: ${matchesRes.status} - ${errorText}` },
        { status: matchesRes.status }
      );
    }

    const matchesData = await matchesRes.json();
    let standingsData = null;

    if (standingsRes.ok) {
      standingsData = await standingsRes.json();
    } else {
      const errorText = await standingsRes.text();
      console.warn('Standings API error (non-fatal):', standingsRes.status, errorText);
    }

    return NextResponse.json({
      matches: matchesData,
      standings: standingsData,
    });
  } catch (error: any) {
    console.error('Error fetching Manchester United data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
