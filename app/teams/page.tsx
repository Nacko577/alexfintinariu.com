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

const teamsConfig = [
    {
      id: 'manchester-united',
      name: 'Manchester United',
      league: 'Premier League',
      leagueSub: 'England',
      icon: '/united.png',
      loader: loadManchesterUnited,
    },
    {
      id: 'baltimore-orioles',
      name: 'Baltimore Orioles',
      league: 'MLB',
      leagueSub: 'AL East',
      icon: '/orioles.png',
      loader: loadBaltimoreOrioles,
    },
    {
      id: 'baltimore-ravens',
      name: 'Baltimore Ravens',
      league: 'NFL',
      leagueSub: 'AFC North',
      icon: '/ravens.png',
      loader: loadBaltimoreRavens,
    },
    {
      id: 'la-lakers',
      name: 'LA Lakers',
      league: 'NBA',
      leagueSub: 'Western Conference',
      icon: '/lakers.png',
      loader: loadLakers,
    },
];

interface TeamError {
  hasError: boolean;
  message?: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Record<string, TeamData>>({});
  const [errors, setErrors] = useState<Record<string, TeamError>>({});
  const [loading, setLoading] = useState(true);

  const loadTeam = async (team: typeof teamsConfig[0], updateProgress: (increment: number) => void) => {
    try {
      const data = await team.loader();
      setTeams(prev => ({ ...prev, [team.id]: data }));
      setErrors(prev => ({ ...prev, [team.id]: { hasError: false } }));
      updateProgress(1);
      return true;
    } catch (error: any) {
      console.error(`Error loading ${team.name}:`, error);
      setErrors(prev => ({
        ...prev,
        [team.id]: {
          hasError: true,
          message: error?.message || 'Failed to load data',
        },
      }));
      setTeams(prev => ({
        ...prev,
        [team.id]: {
          record: 'N/A',
          standing: 'N/A',
          lastResult: 'Unable to load',
          nextFixture: 'Unable to load',
        },
      }));
      updateProgress(1);
      return false;
    }
  };

  const loadTeams = async () => {
    setLoading(true);

    await Promise.all(
      teamsConfig.map(team => loadTeam(team, () => {}))
    );

    setLoading(false);
  };

  const retryTeam = async (teamId: string) => {
    const team = teamsConfig.find(t => t.id === teamId);
    if (!team) return;

    setErrors(prev => ({ ...prev, [teamId]: { hasError: false } }));
    await loadTeam(team, () => {});
  };

  const refreshTeam = async (teamId: string) => {
    const team = teamsConfig.find(t => t.id === teamId);
    if (!team) return;

    try {
      // Add minimum delay to show "Updating..." state
      const [data] = await Promise.all([
        team.loader(),
        new Promise(resolve => setTimeout(resolve, 800)) // Minimum 800ms delay
      ]);
      
      setTeams(prev => ({ ...prev, [teamId]: data }));
      setErrors(prev => ({ ...prev, [teamId]: { hasError: false } }));
    } catch (error: any) {
      console.error(`Error refreshing ${team.name}:`, error);
      setErrors(prev => ({
        ...prev,
        [teamId]: {
          hasError: true,
          message: error?.message || 'Failed to refresh data',
        },
      }));
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="teams-section">
          <div className="container">
            <div className="section-header">
              <h1 className="section-title">My Teams</h1>
              <p className="section-subtitle">Schedules, standings, and latest results across all your favorite sports</p>
            </div>

            {teamsConfig.length === 0 ? (
              <div className="empty-state">
                <p>No teams configured</p>
              </div>
            ) : (
              <div className="teams-grid">
                {teamsConfig.map((team) => (
                  <TeamCard
                    key={team.id}
                    teamId={team.id}
                    name={team.name}
                    league={team.league}
                    leagueSub={team.leagueSub}
                    icon={team.icon}
                    data={teams[team.id] || { record: '', standing: '', lastResult: '', nextFixture: '' }}
                    loading={loading}
                    error={errors[team.id]}
                    onRetry={() => retryTeam(team.id)}
                    onRefresh={() => refreshTeam(team.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
