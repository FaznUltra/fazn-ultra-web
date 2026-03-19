'use client';

import { Gamepad2, DollarSign, Trophy, XCircle } from 'lucide-react';

interface StatsGridProps {
  totalChallenges: number;
  wins: number;
  losses: number;
  draws?: number;
  totalEarnings: number;
}

export function StatsGrid({
  totalChallenges,
  wins,
  losses,
  totalEarnings,
}: StatsGridProps) {
  const winRate = totalChallenges > 0 ? Math.round((wins / totalChallenges) * 100) : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(1)}K`;
    return `₦${amount.toLocaleString()}`;
  };

  const formatCount = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return `${n}`;
  };

  return (
    <div className="px-4 py-3 space-y-2.5">
      {/* Top row - two equal cards */}
      <div className="flex gap-2.5">
        <div className="flex-1 bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
          <div className="flex justify-between items-center mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--ultra-primary-light)' }}>
              <Gamepad2 className="h-4 w-4" style={{ color: 'var(--ultra-primary)' }} />
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wider" style={{ color: 'var(--ultra-primary)', background: 'var(--ultra-primary-light)' }}>
              ALL TIME
            </span>
          </div>
          <p className="text-2xl font-extrabold leading-tight tracking-tight" style={{ color: 'var(--ultra-text)' }}>
            {formatCount(totalChallenges)}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'var(--ultra-text-muted)' }}>
            Total Challenges
          </p>
        </div>

        <div className="flex-1 bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
          <div className="flex justify-between items-center mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <DollarSign className="h-4 w-4" style={{ color: '#D97706' }} />
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wider" style={{ color: '#D97706', background: '#FEF3C7' }}>
              NET
            </span>
          </div>
          <p className="text-2xl font-extrabold leading-tight tracking-tight" style={{ color: '#D97706' }}>
            {formatCurrency(totalEarnings)}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'var(--ultra-text-muted)' }}>
            Total Earnings
          </p>
        </div>
      </div>

      {/* Bottom row - wins + losses + win rate */}
      <div className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
        <div className="flex items-center">
          {/* Wins */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5" style={{ background: '#ECFDF5' }}>
              <Trophy className="h-3.5 w-3.5" style={{ color: '#059669' }} />
            </div>
            <p className="text-2xl font-extrabold leading-tight tracking-tight" style={{ color: '#059669' }}>
              {formatCount(wins)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'var(--ultra-text-muted)' }}>
              Wins
            </p>
          </div>

          <div className="w-px h-14 mx-2" style={{ background: 'var(--ultra-border)' }} />

          {/* Win Rate */}
          <div className="flex-[1.4] flex flex-col items-center gap-1">
            <p className="text-xl font-extrabold leading-tight tracking-tight" style={{ color: 'var(--ultra-text)' }}>
              {winRate}%
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ultra-text-muted)' }}>
              Win Rate
            </p>
            <div className="w-4/5 h-1 rounded-full overflow-hidden mt-1" style={{ background: 'var(--ultra-border)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${winRate}%`, background: '#059669' }}
              />
            </div>
          </div>

          <div className="w-px h-14 mx-2" style={{ background: 'var(--ultra-border)' }} />

          {/* Losses */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5" style={{ background: '#FEF2F2' }}>
              <XCircle className="h-3.5 w-3.5" style={{ color: '#DC2626' }} />
            </div>
            <p className="text-2xl font-extrabold leading-tight tracking-tight" style={{ color: '#DC2626' }}>
              {formatCount(losses)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'var(--ultra-text-muted)' }}>
              Losses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
