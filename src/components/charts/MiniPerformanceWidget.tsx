'use client';

import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MiniPerformanceWidgetProps {
  challengeHistory: Array<{
    createdAt: string;
    status: string;
    winner?: { _id: string; displayName: string; profileImage?: string };
    creator: { _id: string; displayName: string; profileImage?: string };
  }>;
  userId?: string;
}

export function MiniPerformanceWidget({ challengeHistory, userId }: MiniPerformanceWidgetProps) {
  const { chartData, winRate, trend } = useMemo(() => {
    if (!challengeHistory || challengeHistory.length === 0) {
      return { chartData: [], winRate: 0, trend: 'neutral' };
    }

    // Get last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toDateString(),
        wins: 0,
        total: 0,
      };
    });

    challengeHistory.forEach((challenge) => {
      const challengeDate = new Date(challenge.createdAt).toDateString();
      const dayData = last7Days.find(d => d.date === challengeDate);
      
      if (dayData && (challenge.status === 'SETTLED' || challenge.status === 'COMPLETED')) {
        dayData.total += 1;
        if (challenge.winner?._id === userId) {
          dayData.wins += 1;
        }
      }
    });

    const data = last7Days.map(d => ({
      winRate: d.total > 0 ? (d.wins / d.total) * 100 : 0,
    }));

    const totalWins = last7Days.reduce((sum, d) => sum + d.wins, 0);
    const totalGames = last7Days.reduce((sum, d) => sum + d.total, 0);
    const overallWinRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

    // Determine trend
    const firstHalf = data.slice(0, 3).reduce((sum, d) => sum + d.winRate, 0) / 3;
    const secondHalf = data.slice(4).reduce((sum, d) => sum + d.winRate, 0) / 3;
    const trendDirection = secondHalf > firstHalf ? 'up' : secondHalf < firstHalf ? 'down' : 'neutral';

    return { 
      chartData: data, 
      winRate: Math.round(overallWinRate),
      trend: trendDirection,
    };
  }, [challengeHistory, userId]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs text-white/40">7-Day Win Rate</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-lg font-bold" style={{ color: winRate >= 50 ? '#00FFB2' : '#FF6B6B' }}>
              {winRate}%
            </p>
            {trend === 'up' && <TrendingUp className="h-3 w-3 text-[#00FFB2]" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3 text-[#FF6B6B]" />}
          </div>
        </div>
        <ResponsiveContainer width={80} height={40}>
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="winRate"
              stroke={winRate >= 50 ? '#00FFB2' : '#7C8CFF'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
