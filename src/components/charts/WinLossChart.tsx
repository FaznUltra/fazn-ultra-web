'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface WinLossChartProps {
  wins: number;
  losses: number;
  draws?: number;
}

export function WinLossChart({ wins, losses, draws = 0 }: WinLossChartProps) {
  const data = [
    { name: 'Wins', value: wins, color: '#00FFB2' },
    { name: 'Losses', value: losses, color: '#FF6B6B' },
  ];

  if (draws > 0) {
    data.push({ name: 'Draws', value: draws, color: '#FBCB4A' });
  }

  const total = wins + losses + draws;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div 
          className="rounded-xl border border-white/10 p-3 shadow-xl backdrop-blur-xl"
          style={{ background: 'rgba(3,6,11,0.95)' }}
        >
          <p className="text-xs text-white/60 mb-1">{payload[0].name}</p>
          <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].value} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy }: any) => {
    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold"
          fill="#00FFB2"
        >
          {winRate}%
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs"
          fill="rgba(255,255,255,0.5)"
        >
          Win Rate
        </text>
      </g>
    );
  };

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white mb-1">Performance</h3>
          <p className="text-xs text-white/40">Your win/loss distribution</p>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(0,255,178,0.1)' }}>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-sm text-white/40">No challenges yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white mb-1">Performance</h3>
        <p className="text-xs text-white/40">Your win/loss distribution</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={<CustomLabel />}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-4 mt-4">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ background: entry.color }}
            />
            <span className="text-xs text-white/60">
              {entry.name}: <span className="font-bold text-white">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
