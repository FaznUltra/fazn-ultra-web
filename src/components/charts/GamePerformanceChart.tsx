'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface GamePerformanceChartProps {
  challengeHistory: Array<{
    gameName: string;
    status: string;
    winner?: { _id: string; displayName: string; profileImage?: string };
    creator: { _id: string; displayName: string; profileImage?: string };
    acceptor?: { _id: string; displayName: string; profileImage?: string };
  }>;
  userId?: string;
}

export function GamePerformanceChart({ challengeHistory, userId }: GamePerformanceChartProps) {
  const chartData = useMemo(() => {
    if (!challengeHistory || challengeHistory.length === 0) {
      return [];
    }

    // Group by game and calculate win rate
    const gameStats: Record<string, { wins: number; total: number }> = {};

    challengeHistory.forEach((challenge) => {
      const game = challenge.gameName || 'Unknown';
      
      if (!gameStats[game]) {
        gameStats[game] = { wins: 0, total: 0 };
      }

      if (challenge.status === 'SETTLED' || challenge.status === 'COMPLETED') {
        gameStats[game].total += 1;
        if (challenge.winner?._id === userId) {
          gameStats[game].wins += 1;
        }
      }
    });

    // Convert to array
    return Object.entries(gameStats)
      .map(([game, stats]) => ({
        game: game.length > 15 ? game.substring(0, 15) + '...' : game,
        winRate: stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0,
        wins: stats.wins,
        total: stats.total,
      }))
      .sort((a, b) => b.total - a.total); // Sort by most played
  }, [challengeHistory, userId]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="rounded-xl border border-white/10 p-3 shadow-xl backdrop-blur-xl"
          style={{ background: 'rgba(3,6,11,0.95)' }}
        >
          <p className="text-xs text-white/60 mb-1">{data.game}</p>
          <p className="text-sm font-bold" style={{ color: data.winRate >= 50 ? '#00FFB2' : '#FF6B6B' }}>
            {data.winRate}% Win Rate
          </p>
          <p className="text-xs text-white/40 mt-1">
            {data.wins}/{data.total} wins
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white mb-1">Game Performance</h3>
          <p className="text-xs text-white/40">Win rate by game type</p>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(124,140,255,0.1)' }}>
              <span className="text-2xl">🎮</span>
            </div>
            <p className="text-sm text-white/40">No game data yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white mb-1">Game Performance</h3>
        <p className="text-xs text-white/40">Win rate by game type</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="game" 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
            tickLine={false}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(value) => `${value}%`}
            label={{ 
              value: 'Win Rate (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: 'rgba(255,255,255,0.5)', fontSize: 11 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="winRate" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.winRate >= 50 ? '#00FFB2' : '#FF6B6B'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 flex justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: '#00FFB2' }} />
          <span className="text-xs text-white/60">≥50% (Good)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: '#FF6B6B' }} />
          <span className="text-xs text-white/60">&lt;50% (Improve)</span>
        </div>
      </div>
    </div>
  );
}
