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
        return <ArrowDownLeft className="h-5 w-5 text-green-600" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      case 'STAKE_DEBIT':
        return <Minus className="h-5 w-5 text-orange-600" />;
      case 'WINNING_CREDIT':
        return <Trophy className="h-5 w-5 text-yellow-600" />;
      case 'STAKE_REFUND':
        return <Plus className="h-5 w-5 text-blue-600" />;
      case 'WITNESS_REWARD':
        return <Shield className="h-5 w-5 text-purple-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getIconBg = () => {
    switch (transaction.type) {
      case 'DEPOSIT':
        return 'bg-green-50';
      case 'WITHDRAWAL':
        return 'bg-red-50';
      case 'STAKE_DEBIT':
        return 'bg-orange-50';
      case 'WINNING_CREDIT':
        return 'bg-yellow-50';
      case 'STAKE_REFUND':
        return 'bg-blue-50';
      case 'WITNESS_REWARD':
        return 'bg-purple-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getAmountColor = () => {
    if (transaction.type === 'DEPOSIT' || transaction.type === 'WINNING_CREDIT' || transaction.type === 'STAKE_REFUND' || transaction.type === 'WITNESS_REWARD') {
      return 'text-green-600';
    }
    return 'text-red-600';
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
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full ${getIconBg()} flex items-center justify-center flex-shrink-0`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{transaction.description}</p>
          <p className="text-xs text-gray-500">
            {formatDate(transaction.createdAt)} • {formatTime(transaction.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-base font-bold ${getAmountColor()}`}>
            {getAmountPrefix()}₦{transaction.amount.toLocaleString()}
          </p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            transaction.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
            transaction.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
            transaction.status === 'FAILED' ? 'bg-red-50 text-red-700' :
            'bg-gray-50 text-gray-700'
          }`}>
            {transaction.status}
          </span>
        </div>
      </div>
    </div>
  );
}
