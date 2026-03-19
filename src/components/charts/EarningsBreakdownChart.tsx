'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction } from '@/services/wallet.service';

interface EarningsBreakdownChartProps {
  transactions: Transaction[];
}

export function EarningsBreakdownChart({ transactions }: EarningsBreakdownChartProps) {
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const earnings = {
      deposits: 0,
      winnings: 0,
      refunds: 0,
    };

    transactions.forEach((transaction) => {
      if (transaction.type === 'DEPOSIT') {
        earnings.deposits += transaction.amount;
      } else if (transaction.type === 'WINNING_CREDIT') {
        earnings.winnings += transaction.amount;
      } else if (transaction.type === 'STAKE_REFUND') {
        earnings.refunds += transaction.amount;
      }
    });

    const data = [
      { name: 'Deposits', value: earnings.deposits, color: '#7C8CFF' },
      { name: 'Winnings', value: earnings.winnings, color: '#00FFB2' },
      { name: 'Refunds', value: earnings.refunds, color: '#FBCB4A' },
    ].filter(item => item.value > 0);

    return data;
  }, [transactions]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

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
            ₦{payload[0].value.toLocaleString()}
          </p>
          <p className="text-xs text-white/40 mt-1">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white mb-1">Earnings Breakdown</h3>
          <p className="text-xs text-white/40">Sources of your income</p>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(251,203,74,0.1)' }}>
              <span className="text-2xl">💵</span>
            </div>
            <p className="text-sm text-white/40">No earnings yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white mb-1">Earnings Breakdown</h3>
        <p className="text-xs text-white/40">Sources of your income</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {chartData.map((entry) => {
          const percentage = ((entry.value / total) * 100).toFixed(1);
          return (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ background: entry.color }}
              />
              <span className="text-xs text-white/60">
                {entry.name}: <span className="font-bold text-white">{percentage}%</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <p className="text-xs text-white/40">Total Earnings</p>
        <p className="text-lg font-bold" style={{ color: '#00FFB2' }}>
          ₦{total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
