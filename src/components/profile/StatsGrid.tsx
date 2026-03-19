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
    <div className="px-4 py-4 space-y-3">
      {/* Top row - two equal cards */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.04] backdrop-blur-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,140,255,0.15)' }}>
              <Gamepad2 className="h-4 w-4 text-[#7C8CFF]" />
            </div>
            <span className="text-[9px] font-bold px-2 py-1 rounded-lg tracking-wider" style={{ color: '#7C8CFF', background: 'rgba(124,140,255,0.12)' }}>
              ALL TIME
            </span>
          </div>
          <p className="text-2xl font-extrabold leading-tight tracking-tight text-white">
            {formatCount(totalChallenges)}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide mt-1 text-white/40">
            Total Challenges
          </p>
        </div>

        <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.04] backdrop-blur-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,203,74,0.15)' }}>
              <DollarSign className="h-4 w-4 text-[#FBCB4A]" />
            </div>
            <span className="text-[9px] font-bold px-2 py-1 rounded-lg tracking-wider" style={{ color: '#FBCB4A', background: 'rgba(251,203,74,0.12)' }}>
              NET
            </span>
          </div>
          <p className="text-2xl font-extrabold leading-tight tracking-tight text-[#FBCB4A]">
            {formatCurrency(totalEarnings)}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide mt-1 text-white/40">
            Total Earnings
          </p>
        </div>
      </div>

      {/* Bottom row - wins + losses + win rate */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.04] backdrop-blur-xl p-4">
        <div className="flex items-center">
          {/* Wins */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ background: 'rgba(0,255,178,0.15)' }}>
              <Trophy className="h-4 w-4 text-[#00FFB2]" />
            </div>
            <p className="text-2xl font-extrabold leading-tight tracking-tight text-[#00FFB2]">
              {formatCount(wins)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide mt-1 text-white/40">
              Wins
            </p>
          </div>

          <div className="w-px h-16 mx-2 bg-white/10" />

          {/* Win Rate */}
          <div className="flex-[1.4] flex flex-col items-center gap-1">
            <p className="text-xl font-extrabold leading-tight tracking-tight text-white">
              {winRate}%
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
              Win Rate
            </p>
            <div className="w-4/5 h-1.5 rounded-full overflow-hidden mt-1.5 bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${winRate}%`, background: '#00FFB2' }}
              />
            </div>
          </div>

          <div className="w-px h-16 mx-2 bg-white/10" />

          {/* Losses */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ background: 'rgba(255,107,107,0.15)' }}>
              <XCircle className="h-4 w-4 text-[#FF6B6B]" />
            </div>
            <p className="text-2xl font-extrabold leading-tight tracking-tight text-[#FF6B6B]">
              {formatCount(losses)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide mt-1 text-white/40">
              Losses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
