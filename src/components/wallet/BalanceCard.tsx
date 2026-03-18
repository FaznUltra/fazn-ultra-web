'use client';

import { Plus, ArrowDownToLine, TrendingUp, TrendingDown, Trophy } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalWinnings: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function BalanceCard({
  balance,
  totalDeposits,
  totalWithdrawals,
  totalWinnings,
  onDeposit,
  onWithdraw,
}: BalanceCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 mx-4 mt-4 rounded-3xl p-6 shadow-lg">
      <div className="mb-6">
        <p className="text-sm text-white/80 font-medium mb-1">Available Balance</p>
        <h2 className="text-4xl font-bold text-white">₦{balance.toLocaleString()}</h2>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={onDeposit}
          className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl py-3 flex items-center justify-center gap-2 active:bg-white/30 transition-colors"
        >
          <Plus className="h-5 w-5 text-white" />
          <span className="text-white font-semibold">Deposit</span>
        </button>
        <button
          onClick={onWithdraw}
          className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl py-3 flex items-center justify-center gap-2 active:bg-white/30 transition-colors"
        >
          <ArrowDownToLine className="h-5 w-5 text-white" />
          <span className="text-white font-semibold">Withdraw</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-green-300" />
            <p className="text-xs text-white/70">Deposits</p>
          </div>
          <p className="text-sm font-bold text-white">₦{totalDeposits.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown className="h-3.5 w-3.5 text-red-300" />
            <p className="text-xs text-white/70">Withdrawals</p>
          </div>
          <p className="text-sm font-bold text-white">₦{totalWithdrawals.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-1 mb-1">
            <Trophy className="h-3.5 w-3.5 text-yellow-300" />
            <p className="text-xs text-white/70">Winnings</p>
          </div>
          <p className="text-sm font-bold text-white">₦{totalWinnings.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
