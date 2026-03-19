'use client';

import { ArrowUpRight, ArrowDownLeft, Minus, Plus, Trophy, Shield } from 'lucide-react';
import { Transaction } from '@/services/wallet.service';

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const getIcon = () => {
    switch (transaction.type) {
      case 'DEPOSIT':
        return <ArrowDownLeft className="h-4 w-4 text-[#00FFB2]" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="h-4 w-4 text-[#FF6B6B]" />;
      case 'STAKE_DEBIT':
        return <Minus className="h-4 w-4 text-[#FF9F43]" />;
      case 'WINNING_CREDIT':
        return <Trophy className="h-4 w-4 text-[#FBCB4A]" />;
      case 'STAKE_REFUND':
        return <Plus className="h-4 w-4 text-[#7C8CFF]" />;
      case 'WITNESS_REWARD':
        return <Shield className="h-4 w-4 text-[#FF61D6]" />;
      default:
        return <Minus className="h-4 w-4 text-white/40" />;
    }
  };

  const getIconBg = () => {
    switch (transaction.type) {
      case 'DEPOSIT':
        return 'rgba(0,255,178,0.12)';
      case 'WITHDRAWAL':
        return 'rgba(255,107,107,0.12)';
      case 'STAKE_DEBIT':
        return 'rgba(255,159,67,0.12)';
      case 'WINNING_CREDIT':
        return 'rgba(251,203,74,0.12)';
      case 'STAKE_REFUND':
        return 'rgba(124,140,255,0.12)';
      case 'WITNESS_REWARD':
        return 'rgba(255,97,214,0.12)';
      default:
        return 'rgba(255,255,255,0.05)';
    }
  };

  const getAmountColor = () => {
    if (transaction.type === 'DEPOSIT' || transaction.type === 'WINNING_CREDIT' || transaction.type === 'STAKE_REFUND' || transaction.type === 'WITNESS_REWARD') {
      return 'text-[#00FFB2]';
    }
    return 'text-[#FF6B6B]';
  };

  const getAmountPrefix = () => {
    if (transaction.type === 'DEPOSIT' || transaction.type === 'WINNING_CREDIT' || transaction.type === 'STAKE_REFUND' || transaction.type === 'WITNESS_REWARD') {
      return '+';
    }
    return '-';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.04] backdrop-blur-xl p-3.5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: getIconBg() }}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate text-white leading-tight">{transaction.description}</p>
          <p className="text-[10px] text-white/40 mt-0.5">
            {formatDate(transaction.createdAt)} · {formatTime(transaction.createdAt)}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`text-xs font-bold ${getAmountColor()} leading-tight mb-1`}>
            {getAmountPrefix()}₦{transaction.amount.toLocaleString()}
          </p>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${
            transaction.status === 'COMPLETED' ? 'text-[#00FFB2]' :
            transaction.status === 'PENDING' ? 'text-[#FBCB4A]' :
            transaction.status === 'FAILED' ? 'text-[#FF6B6B]' :
            'text-white/40'
          }`} style={{
            background: transaction.status === 'COMPLETED' ? 'rgba(0,255,178,0.12)' :
            transaction.status === 'PENDING' ? 'rgba(251,203,74,0.12)' :
            transaction.status === 'FAILED' ? 'rgba(255,107,107,0.12)' :
            'rgba(255,255,255,0.05)'
          }}>
            {transaction.status}
          </span>
        </div>
      </div>
    </div>
  );
}
