'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, ArrowDownToLine } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { BalanceCard } from '@/components/wallet/BalanceCard';
import { FilterChips } from '@/components/wallet/FilterChips';
import { TransactionItem } from '@/components/wallet/TransactionItem';

export default function WalletPage() {
  const router = useRouter();
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7d');
  const {
    wallet,
    isWalletLoading,
    transactions,
    isTransactionsLoading,
    refetchWallet,
    refetchTransactions,
    setTransactionFilter,
    transactionFilter,
  } = useWallet(analyticsPeriod);

  const handleFilterChange = (type: string) => {
    setTransactionFilter({
      ...transactionFilter,
      type: type === 'ALL' ? undefined : type,
    });
  };

  if (isWalletLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
        <div className="flex items-center gap-3 h-12 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--ultra-text)' }} />
          </button>
          <h1 className="text-base font-bold" style={{ color: 'var(--ultra-text)' }}>Wallet</h1>
        </div>
      </div>

      <div className="pb-6">
        <BalanceCard
          balance={wallet?.currencies?.find((c) => c.code === 'NGN')?.balance || 0}
          totalDeposits={wallet?.totalDeposits || 0}
          totalWithdrawals={wallet?.totalWithdrawals || 0}
          totalWinnings={wallet?.totalWinnings || 0}
          onDeposit={() => {}}
          onWithdraw={() => {}}
        />

        {/* Transactions */}
        <div className="mt-5 px-4">
          <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--ultra-text)' }}>Transactions</h2>

          <FilterChips
            filters={['ALL', 'DEPOSIT', 'WITHDRAWAL', 'STAKE_DEBIT', 'WINNING_CREDIT', 'STAKE_REFUND']}
            selectedFilter={transactionFilter.type || 'ALL'}
            onFilterChange={handleFilterChange}
          />

          {isTransactionsLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xs" style={{ color: 'var(--ultra-text-muted)' }}>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2 mt-3">
              {transactions.map((transaction) => (
                <TransactionItem key={transaction._id} transaction={transaction} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
