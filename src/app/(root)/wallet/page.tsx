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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Wallet</h1>
          <div className="w-9" />
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
        <div className="mt-6 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Transactions</h2>
            <button className="flex items-center gap-1 text-sm font-semibold text-blue-600">
              <span>See All</span>
              <ArrowDownToLine className="h-4 w-4" />
            </button>
          </div>

          <FilterChips
            filters={['ALL', 'DEPOSIT', 'WITHDRAWAL', 'STAKE_DEBIT', 'WINNING_CREDIT', 'STAKE_REFUND']}
            selectedFilter={transactionFilter.type || 'ALL'}
            onFilterChange={handleFilterChange}
          />

          {isTransactionsLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2 mt-4">
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
