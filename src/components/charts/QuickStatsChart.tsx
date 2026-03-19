'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface QuickStatsChartProps {
  challengeHistory: Array<{
    createdAt: string;
    status: string;
    winner?: { _id: string; displayName: string; profileImage?: string };
    creator: { _id: string; displayName: string; profileImage?: string };
  }>;
  userId?: string;
}

export function QuickStatsChart({ challengeHistory, userId }: QuickStatsChartProps) {
  const chartData = useMemo(() => {
    if (!challengeHistory || challengeHistory.length === 0) {
      return [];
    }

    // Get last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toDateString(),
        wins: 0,
        losses: 0,
      };
    });

    challengeHistory.forEach((challenge) => {
      const challengeDate = new Date(challenge.createdAt).toDateString();
      const dayData = last7Days.find(d => d.date === challengeDate);
      
      if (dayData && (challenge.status === 'SETTLED' || challenge.status === 'COMPLETED')) {
        if (challenge.winner?._id === userId) {
          dayData.wins += 1;
        } else {
          dayData.losses += 1;
        }
      }
    });

    return last7Days.map(d => ({
      day: d.day,
      total: d.wins + d.losses,
      wins: d.wins,
    }));
  }, [challengeHistory, userId]);

  const maxValue = Math.max(...chartData.map(d => d.total), 1);

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-4">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-white mb-1">Last 7 Days</h3>
        <p className="text-xs text-white/40">Your recent activity</p>
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="day" 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            domain={[0, maxValue + 1]}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.wins > entry.total / 2 ? '#00FFB2' : '#7C8CFF'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-2 text-center">
        <p className="text-xs text-white/50">
          <span className="font-semibold text-white/70">Y-axis:</span> Number of games played each day
        </p>
      </div>
    </div>
  );
}
