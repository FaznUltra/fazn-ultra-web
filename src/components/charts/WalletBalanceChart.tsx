'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/services/wallet.service';

interface WalletBalanceChartProps {
  transactions: Transaction[];
  currentBalance: number;
}

export function WalletBalanceChart({ transactions, currentBalance }: WalletBalanceChartProps) {
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [{ date: 'Now', balance: currentBalance }];
    }

    // Sort transactions by date (oldest first)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Create data points from transactions
    const data = sortedTransactions.map((transaction) => ({
      date: new Date(transaction.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      balance: transaction.balanceAfter,
      fullDate: transaction.createdAt,
    }));

    // Add current balance as the last point if needed
    if (data.length > 0 && data[data.length - 1].balance !== currentBalance) {
      data.push({
        date: 'Now',
        balance: currentBalance,
        fullDate: new Date().toISOString(),
      });
    }

    return data;
  }, [transactions, currentBalance]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="rounded-xl border border-white/10 p-3 shadow-xl backdrop-blur-xl"
          style={{ background: 'rgba(3,6,11,0.95)' }}
        >
          <p className="text-xs text-white/60 mb-1">{payload[0].payload.date}</p>
          <p className="text-sm font-bold" style={{ color: '#00FFB2' }}>
            ₦{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white mb-1">Balance History</h3>
        <p className="text-xs text-white/40">Track your wallet balance over time</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FFB2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00FFB2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
            tickLine={false}
            tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
            label={{ 
              value: 'Balance (₦)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: 'rgba(255,255,255,0.5)', fontSize: 11 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#00FFB2"
            strokeWidth={2}
            fill="url(#balanceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
