'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '@/services/wallet.service';

interface TransactionAnalyticsChartProps {
  transactions: Transaction[];
}

export function TransactionAnalyticsChart({ transactions }: TransactionAnalyticsChartProps) {
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Group by month
    const monthlyData: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }

      // Income: deposits and winnings
      if (transaction.type === 'DEPOSIT' || transaction.type === 'WINNING_CREDIT' || transaction.type === 'STAKE_REFUND') {
        monthlyData[monthKey].income += transaction.amount;
      }
      // Expenses: withdrawals and stakes
      else if (transaction.type === 'WITHDRAWAL' || transaction.type === 'STAKE_DEBIT') {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });

    // Convert to array and get last 6 months
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: Math.round(data.income),
        expenses: Math.round(data.expenses),
        net: Math.round(data.income - data.expenses),
      }))
      .slice(-6);
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="rounded-xl border border-white/10 p-3 shadow-xl backdrop-blur-xl"
          style={{ background: 'rgba(3,6,11,0.95)' }}
        >
          <p className="text-xs text-white/60 mb-2">{payload[0].payload.month}</p>
          <div className="space-y-1">
            <p className="text-xs">
              <span className="text-white/60">Income: </span>
              <span className="font-bold" style={{ color: '#00FFB2' }}>
                ₦{payload[0].payload.income.toLocaleString()}
              </span>
            </p>
            <p className="text-xs">
              <span className="text-white/60">Expenses: </span>
              <span className="font-bold" style={{ color: '#FF6B6B' }}>
                ₦{payload[0].payload.expenses.toLocaleString()}
              </span>
            </p>
            <p className="text-xs pt-1 border-t border-white/10">
              <span className="text-white/60">Net: </span>
              <span className="font-bold" style={{ color: payload[0].payload.net >= 0 ? '#00FFB2' : '#FF6B6B' }}>
                ₦{payload[0].payload.net.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white mb-1">Transaction Analytics</h3>
          <p className="text-xs text-white/40">Monthly income vs expenses</p>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(124,140,255,0.1)' }}>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-sm text-white/40">No transaction data yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white mb-1">Transaction Analytics</h3>
        <p className="text-xs text-white/40">Monthly income vs expenses (last 6 months)</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="month" 
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
              value: 'Amount (₦)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: 'rgba(255,255,255,0.5)', fontSize: 11 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar dataKey="income" fill="#00FFB2" radius={[4, 4, 0, 0]} name="Income" />
          <Bar dataKey="expenses" fill="#FF6B6B" radius={[4, 4, 0, 0]} name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
