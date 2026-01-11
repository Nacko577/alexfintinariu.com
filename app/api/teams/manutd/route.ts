import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.FOOTBALL_API_KEY;

  console.log('API Route called - FOOTBALL_API_KEY exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);

  if (!apiKey) {
    console.error('❌ FOOTBALL_API_KEY not configured in environment variables');
    return NextResponse.json(
      { error: 'FOOTBALL_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    console.log('Fetching data from football-data.org...');
    const [matchesRes, standingsRes] = await Promise.all([
      fetch('https://api.football-data.org/v4/teams/66/matches?competitions=PL&limit=20', {
        headers: {
          'X-Auth-Token': apiKey,
        },
      }),
      fetch('https://api.football-data.org/v4/competitions/PL/standings', {
        headers: {
          'X-Auth-Token': apiKey,
        },
      }),
    ]);

    console.log('Matches API status:', matchesRes.status);
    console.log('Standings API status:', standingsRes.status);

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

    console.log('✅ Successfully fetched data - matches:', matchesData.matches?.length || 0);
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
