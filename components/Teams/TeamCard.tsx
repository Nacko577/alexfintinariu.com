'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TeamCardProps {
  teamId: string;
  name: string;
  league: string;
  leagueSub?: string;
  icon: string;
  data: {
    record: string;
    standing: string;
    lastResult: string;
    nextFixture: string;
    points?: string;
    winRate?: number;
    trend?: 'up' | 'down' | 'neutral';
  };
  loading?: boolean;
  error?: {
    hasError: boolean;
    message?: string;
  };
  onRetry?: () => void;
  onRefresh?: () => void;
}

function getTrendArrow(trend: 'up' | 'down' | 'neutral') {
  switch (trend) {
    case 'up': return '↗';
    case 'down': return '↘';
    case 'neutral': return '—';
  }
}

function getTrendLabel(trend: 'up' | 'down' | 'neutral') {
  switch (trend) {
    case 'up': return 'Up';
    case 'down': return 'Down';
    case 'neutral': return 'Neutral';
  }
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

export default function TeamCard({ teamId, name, league, leagueSub, icon, data, loading, error, onRetry, onRefresh }: TeamCardProps) {
  const [refreshing, setRefreshing] = useState(false);
  const hasError = error?.hasError && !loading;

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  // Determine if this team uses points (soccer) or trend (US sports)
  const showPoints = teamId === 'manchester-united';

  return (
    <div className={`team-card ${loading ? 'loading' : ''} ${hasError ? 'has-error' : ''} ${refreshing ? 'refreshing' : ''}`} data-team={teamId}>
      {/* Team-colored top border */}
      <div className="team-color-bar" />

      {/* Header: Logo + Info + Refresh */}
      <div className="team-header">
        <div className="team-logo">
          {loading ? (
            <div className="skeleton skeleton-logo"></div>
          ) : (
            <Image
              src={icon}
              alt={`${name} logo`}
              width={104}
              height={104}
              quality={100}
              unoptimized
              className="team-icon-img"
            />
          )}
        </div>
        <div className="team-info">
          {loading ? (
            <>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-subtitle"></div>
            </>
          ) : (
            <>
              <h2 className="team-name">{name}</h2>
              <p className="team-league">
                {league}
                {leagueSub && (
                  <>
                    <span className="league-separator">|</span>
                    {leagueSub}
                  </>
                )}
              </p>
            </>
          )}
        </div>
        {!loading && onRefresh && (
          <button
            className="team-refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label={`Refresh ${name} data`}
            title="Refresh team data"
          >
            <span className={`team-refresh-icon ${refreshing ? 'spinning' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
                <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
              </svg>
            </span>
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="team-stats">
        <div className="stat-item">
          <span className="stat-label">Record</span>
          {loading ? (
            <div className="skeleton skeleton-stat"></div>
          ) : refreshing ? (
            <span className="stat-value updating">Updating...</span>
          ) : (
            <span className="stat-value">{data.record || 'N/A'}</span>
          )}
        </div>
        <div className="stat-item">
          <span className="stat-label">Standing</span>
          {loading ? (
            <div className="skeleton skeleton-stat"></div>
          ) : refreshing ? (
            <span className="stat-value updating">Updating...</span>
          ) : (
            <span className="stat-value">{data.standing || 'N/A'}</span>
          )}
        </div>

        {/* Points for soccer, Trend for US sports */}
        {showPoints ? (
          <div className="stat-item">
            <span className="stat-label">Points</span>
            {loading ? (
              <div className="skeleton skeleton-stat"></div>
            ) : refreshing ? (
              <span className="stat-value updating">Updating...</span>
            ) : (
              <span className="stat-value">{data.points ?? 'N/A'}</span>
            )}
          </div>
        ) : (
          <div className="stat-item">
            <span className="stat-label">Trend</span>
            {loading ? (
              <div className="skeleton skeleton-stat"></div>
            ) : refreshing ? (
              <span className="stat-value updating">Updating...</span>
            ) : data.trend ? (
              <span className={`stat-value trend-value trend-${data.trend}`}>
                <span className="trend-arrow">{getTrendArrow(data.trend)}</span> {getTrendLabel(data.trend)}
              </span>
            ) : (
              <span className="stat-value">N/A</span>
            )}
          </div>
        )}
      </div>

      {/* Win Rate Bar */}
      <div className="win-rate-section">
        <div className="win-rate-header">
          <span className="win-rate-label">WIN RATE</span>
          {loading ? (
            <div className="skeleton skeleton-winrate-pct"></div>
          ) : refreshing ? (
            <span className="win-rate-pct updating">...</span>
          ) : (
            <span className="win-rate-pct">{data.winRate != null ? `${data.winRate}%` : 'N/A'}</span>
          )}
        </div>
        <div className="win-rate-track">
          {loading || refreshing ? (
            <div className="skeleton skeleton-winrate-bar"></div>
          ) : (
            <div
              className="win-rate-fill"
              style={{ width: `${data.winRate ?? 0}%` }}
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="team-results">
        <div className="result-item">
          <div className="result-icon"><TrophyIcon /></div>
          <div className="result-content">
            <span className="result-label">LAST RESULT</span>
            {loading ? (
              <div className="skeleton skeleton-result"></div>
            ) : refreshing ? (
              <span className="result-value updating">Updating...</span>
            ) : (
              <span className="result-value">{data.lastResult || 'N/A'}</span>
            )}
          </div>
        </div>
        <div className="result-item">
          <div className="result-icon"><CalendarIcon /></div>
          <div className="result-content">
            <span className="result-label">NEXT GAME</span>
            {loading ? (
              <div className="skeleton skeleton-result"></div>
            ) : refreshing ? (
              <span className="result-value updating">Updating...</span>
            ) : (
              <span className="result-value">{data.nextFixture || 'N/A'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Error State */}
      {hasError && (
        <div className="team-error">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error?.message || 'Failed to load data'}</span>
          </div>
          {onRetry && (
            <button className="retry-button" onClick={onRetry} aria-label={`Retry loading ${name}`}>
              <span className="retry-icon">↻</span>
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
