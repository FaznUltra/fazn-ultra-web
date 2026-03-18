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
    <div className="px-4 py-4 space-y-2.5">
      {/* Top row - two equal cards */}
      <div className="flex gap-2.5">
        <div className="flex-1 bg-white rounded-[18px] p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="w-[30px] h-[30px] rounded-lg bg-blue-50 flex items-center justify-center">
              <Gamepad2 className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md tracking-wider">
              ALL TIME
            </span>
          </div>
          <p className="text-[28px] font-extrabold text-gray-900 leading-[34px] tracking-tight">
            {formatCount(totalChallenges)}
          </p>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
            Total Challenges
          </p>
        </div>

        <div className="flex-1 bg-white rounded-[18px] p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="w-[30px] h-[30px] rounded-lg bg-amber-50 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md tracking-wider">
              NET
            </span>
          </div>
          <p className="text-[28px] font-extrabold text-amber-600 leading-[34px] tracking-tight">
            {formatCurrency(totalEarnings)}
          </p>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
            Total Earnings
          </p>
        </div>
      </div>

      {/* Bottom row - wins + losses + win rate */}
      <div className="bg-white rounded-[18px] p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center">
          {/* Wins */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-[30px] h-[30px] rounded-lg bg-green-50 flex items-center justify-center mb-3">
              <Trophy className="h-[15px] w-[15px] text-green-600" />
            </div>
            <p className="text-[28px] font-extrabold text-green-600 leading-[34px] tracking-tight">
              {formatCount(wins)}
            </p>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
              Wins
            </p>
          </div>

          {/* Divider */}
          <div className="w-px h-16 bg-gray-100 mx-2" />

          {/* Win Rate */}
          <div className="flex-[1.4] flex flex-col items-center gap-1">
            <p className="text-[26px] font-extrabold text-gray-900 leading-tight tracking-tight">
              {winRate}%
            </p>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Win Rate
            </p>
            <div className="w-4/5 h-[5px] bg-gray-100 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${winRate}%` }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-16 bg-gray-100 mx-2" />

          {/* Losses */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-[30px] h-[30px] rounded-lg bg-red-50 flex items-center justify-center mb-3">
              <XCircle className="h-[15px] w-[15px] text-red-600" />
            </div>
            <p className="text-[28px] font-extrabold text-red-600 leading-[34px] tracking-tight">
              {formatCount(losses)}
            </p>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
              Losses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
