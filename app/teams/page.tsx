'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamCard from '@/components/Teams/TeamCard';
import {
  loadManchesterUnited,
  loadBaltimoreOrioles,
  loadBaltimoreRavens,
  loadLakers,
  TeamData,
} from '@/lib/teams';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Record<string, TeamData>>({});
  const [loading, setLoading] = useState(true);

  const teamsConfig = [
    {
      id: 'manchester-united',
      name: 'Manchester United',
      league: 'Premier League',
      icon: '/united.png',
      loader: loadManchesterUnited,
    },
    {
      id: 'baltimore-orioles',
      name: 'Baltimore Orioles',
      league: 'MLB - AL East',
      icon: '/orioles.png',
      loader: loadBaltimoreOrioles,
    },
    {
      id: 'baltimore-ravens',
      name: 'Baltimore Ravens',
      league: 'NFL - AFC North',
      icon: '/ravens.png',
      loader: loadBaltimoreRavens,
    },
    {
      id: 'la-lakers',
      name: 'LA Lakers',
      league: 'NBA - Western Conference',
      icon: '/lakers.png',
      loader: loadLakers,
    },
  ];

  useEffect(() => {
    async function loadTeams() {
      setLoading(true);
      const teamData: Record<string, TeamData> = {};

      await Promise.all(
        teamsConfig.map(async (team) => {
          try {
            const data = await team.loader();
            teamData[team.id] = data;
          } catch (error) {
            console.error(`Error loading ${team.name}:`, error);
            teamData[team.id] = {
              record: 'N/A',
              standing: 'N/A',
              lastResult: 'Unable to load',
              nextFixture: 'Unable to load',
            };
          }
        })
      );

      setTeams(teamData);
      setLoading(false);
    }

    loadTeams();

    // Auto-refresh every 30 minutes
    const interval = setInterval(loadTeams, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="teams-section">
          <div className="container">
            <div className="section-header">
              <h1 className="section-title">My Teams</h1>
              <p className="section-subtitle">Schedules, standings, and latest results</p>
            </div>

            <div className="teams-grid">
              {teamsConfig.map((team) => (
                <TeamCard
                  key={team.id}
                  teamId={team.id}
                  name={team.name}
                  league={team.league}
                  icon={team.icon}
                  data={teams[team.id] || { record: '', standing: '', lastResult: '', nextFixture: '' }}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
