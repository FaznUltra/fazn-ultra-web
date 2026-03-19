'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceTrendChartProps {
  challengeHistory: Array<{
    createdAt: string;
    status: string;
    winner?: { _id: string; displayName: string; profileImage?: string };
    creator: { _id: string; displayName: string; profileImage?: string };
    acceptor?: { _id: string; displayName: string; profileImage?: string };
  }>;
  userId?: string;
}

export function PerformanceTrendChart({ challengeHistory, userId }: PerformanceTrendChartProps) {
  const chartData = useMemo(() => {
    if (!challengeHistory || challengeHistory.length === 0) {
      return [];
    }

    // Group challenges by week and calculate win rate
    const weeklyData: Record<string, { wins: number; total: number }> = {};

    challengeHistory.forEach((challenge) => {
      const date = new Date(challenge.createdAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week
      const weekKey = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { wins: 0, total: 0 };
      }

      if (challenge.status === 'SETTLED' || challenge.status === 'COMPLETED') {
        weeklyData[weekKey].total += 1;
        if (challenge.winner?._id === userId) {
          weeklyData[weekKey].wins += 1;
        }
      }
    });

    // Convert to array and calculate win rate
    return Object.entries(weeklyData)
      .map(([week, data]) => ({
        week,
        winRate: data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0,
        wins: data.wins,
        total: data.total,
      }))
      .slice(-8); // Last 8 weeks
  }, [challengeHistory, userId]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="rounded-xl border border-white/10 p-3 shadow-xl backdrop-blur-xl"
          style={{ background: 'rgba(3,6,11,0.95)' }}
        >
          <p className="text-xs text-white/60 mb-1">{payload[0].payload.week}</p>
          <p className="text-sm font-bold" style={{ color: '#00FFB2' }}>
            {payload[0].value}% Win Rate
          </p>
          <p className="text-xs text-white/40 mt-1">
            {payload[0].payload.wins}/{payload[0].payload.total} wins
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
          <h3 className="text-sm font-bold text-white mb-1">Performance Trend</h3>
          <p className="text-xs text-white/40">Your win rate over time</p>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(0,255,178,0.1)' }}>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-sm text-white/40">Not enough data yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white mb-1">Performance Trend</h3>
        <p className="text-xs text-white/40">Your win rate over the last 8 weeks</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="week" 
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
          <Line
            type="monotone"
            dataKey="winRate"
            stroke="#00FFB2"
            strokeWidth={3}
            dot={{ fill: '#00FFB2', r: 4 }}
            activeDot={{ r: 6, fill: '#00FFB2' }}
          />
          {/* 50% reference line */}
          <Line
            type="monotone"
            dataKey={() => 50}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-3 text-center">
        <p className="text-xs text-white/40">
          Dashed line = 50% (break-even)
        </p>
      </div>
    </div>
  );
}
