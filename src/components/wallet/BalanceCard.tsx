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
    <div className="mx-4 mt-4 rounded-3xl p-6 relative overflow-hidden border border-white/5" style={{ background: 'linear-gradient(135deg, #131A31 0%, #0B0F1B 50%, #05070C 100%)' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#00FFB2]/10 via-transparent to-[#7C8CFF]/10" />
      <div className="relative mb-6">
        <p className="text-xs text-white/50 font-semibold mb-2 uppercase tracking-wider">Available Balance</p>
        <h2 className="text-4xl font-extrabold text-white mb-1">₦{balance.toLocaleString()}</h2>
        <div className="h-1 w-20 rounded-full" style={{ background: '#00FFB2' }} />
      </div>

      <div className="relative flex gap-3 mb-6">
        <button
          onClick={onDeposit}
          className="flex-1 rounded-2xl py-3 flex items-center justify-center gap-2 font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: '#00FFB2', color: '#05070b' }}
        >
          <Plus className="h-4 w-4" />
          <span>Deposit</span>
        </button>
        <button
          onClick={onWithdraw}
          className="flex-1 rounded-2xl py-3 flex items-center justify-center gap-2 font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/20"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}
        >
          <ArrowDownToLine className="h-4 w-4" />
          <span>Withdraw</span>
        </button>
      </div>

      <div className="relative grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-3 border border-white/5" style={{ background: 'rgba(0,255,178,0.08)' }}>
          <div className="flex items-center gap-1 mb-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#00FFB2]" />
            <p className="text-[9px] text-white/50 font-semibold uppercase tracking-wide">Deposits</p>
          </div>
          <p className="text-xs font-bold text-[#00FFB2]">₦{totalDeposits.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl p-3 border border-white/5" style={{ background: 'rgba(255,107,107,0.08)' }}>
          <div className="flex items-center gap-1 mb-1.5">
            <TrendingDown className="h-3.5 w-3.5 text-[#FF6B6B]" />
            <p className="text-[9px] text-white/50 font-semibold uppercase tracking-wide">Withdrawals</p>
          </div>
          <p className="text-xs font-bold text-[#FF6B6B]">₦{totalWithdrawals.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl p-3 border border-white/5" style={{ background: 'rgba(251,203,74,0.08)' }}>
          <div className="flex items-center gap-1 mb-1.5">
            <Trophy className="h-3.5 w-3.5 text-[#FBCB4A]" />
            <p className="text-[9px] text-white/50 font-semibold uppercase tracking-wide">Winnings</p>
          </div>
          <p className="text-xs font-bold text-[#FBCB4A]">₦{totalWinnings.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
