'use client';

import Image from 'next/image';

interface TeamCardProps {
  teamId: string;
  name: string;
  league: string;
  icon: string;
  data: {
    record: string;
    standing: string;
    lastResult: string;
    nextFixture: string;
    points?: string;
  };
  loading?: boolean;
}

export default function TeamCard({ teamId, name, league, icon, data, loading }: TeamCardProps) {
  return (
    <div className={`team-card ${loading ? 'data-loading' : ''}`} data-team={teamId}>
      <div className="team-header">
        <div className="team-logo">
          <Image
            src={icon}
            alt={`${name} logo`}
            width={60}
            height={60}
            className="team-icon team-icon-img"
          />
        </div>
        <div className="team-info">
          <h2 className="team-name">{name}</h2>
          <p className="team-league">{league}</p>
        </div>
      </div>
      <div className="team-stats">
        <div className="stat-item">
          <span className="stat-label">Record</span>
          <span className="stat-value">{loading ? 'Loading...' : data.record}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Standing</span>
          <span className="stat-value">{loading ? 'Loading...' : data.standing}</span>
        </div>
        {data.points !== undefined && (
          <div className="stat-item">
            <span className="stat-label">Points</span>
            <span className="stat-value">{loading ? 'Loading...' : data.points}</span>
          </div>
        )}
      </div>
      <div className="team-results">
        <div className="result-item">
          <span className="result-label">Last Result</span>
          <span className="result-value">{loading ? 'Loading...' : data.lastResult}</span>
        </div>
        <div className="result-item">
          <span className="result-label">
            {teamId === 'manchester-united' ? 'Next Fixture' : 'Next Game'}
          </span>
          <span className="result-value">{loading ? 'Loading...' : data.nextFixture}</span>
        </div>
      </div>
    </div>
  );
}
