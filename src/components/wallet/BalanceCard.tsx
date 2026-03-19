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
    <div className="mx-4 mt-4 rounded-2xl p-5" style={{ background: 'var(--ultra-primary)' }}>
      <div className="mb-5">
        <p className="text-xs text-white/70 font-medium mb-1">Available Balance</p>
        <h2 className="text-3xl font-bold text-white">₦{balance.toLocaleString()}</h2>
      </div>

      <div className="flex gap-2.5 mb-5">
        <button
          onClick={onDeposit}
          className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl py-2.5 flex items-center justify-center gap-1.5 active:bg-white/25 transition-colors"
        >
          <Plus className="h-4 w-4 text-white" />
          <span className="text-white text-sm font-semibold">Deposit</span>
        </button>
        <button
          onClick={onWithdraw}
          className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl py-2.5 flex items-center justify-center gap-1.5 active:bg-white/25 transition-colors"
        >
          <ArrowDownToLine className="h-4 w-4 text-white" />
          <span className="text-white text-sm font-semibold">Withdraw</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
          <div className="flex items-center gap-1 mb-0.5">
            <TrendingUp className="h-3 w-3 text-green-300" />
            <p className="text-[10px] text-white/60">Deposits</p>
          </div>
          <p className="text-xs font-bold text-white">₦{totalDeposits.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
          <div className="flex items-center gap-1 mb-0.5">
            <TrendingDown className="h-3 w-3 text-red-300" />
            <p className="text-[10px] text-white/60">Withdrawals</p>
          </div>
          <p className="text-xs font-bold text-white">₦{totalWithdrawals.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
          <div className="flex items-center gap-1 mb-0.5">
            <Trophy className="h-3 w-3 text-yellow-300" />
            <p className="text-[10px] text-white/60">Winnings</p>
          </div>
          <p className="text-xs font-bold text-white">₦{totalWinnings.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
