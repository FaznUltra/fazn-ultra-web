'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, ArrowDownToLine, Receipt } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { BalanceCard } from '@/components/wallet/BalanceCard';
import { FilterChips } from '@/components/wallet/FilterChips';
import { TransactionItem } from '@/components/wallet/TransactionItem';
import { WalletBalanceChart } from '@/components/charts/WalletBalanceChart';
import { TransactionAnalyticsChart } from '@/components/charts/TransactionAnalyticsChart';
import { EarningsBreakdownChart } from '@/components/charts/EarningsBreakdownChart';

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
      <div className="min-h-screen bg-[#03060b] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10 border-t-[#00FFB2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03060b] text-white">
      <div className="p-4 lg:p-0 pb-24 lg:pb-6 space-y-5">
        {/* Header */}
        <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5 lg:hidden" style={{ background: 'rgba(3,6,11,0.8)' }}>
          <div className="flex items-center gap-3 h-14 px-4">
            <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <ArrowLeft className="h-5 w-5 text-white/70" />
            </button>
            <h1 className="text-base font-bold">Wallet</h1>
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

          {/* Charts Section */}
          <div className="mt-6 px-4 lg:px-0 space-y-4">
            <WalletBalanceChart 
              transactions={transactions}
              currentBalance={wallet?.currencies?.find((c) => c.code === 'NGN')?.balance || 0}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TransactionAnalyticsChart transactions={transactions} />
              <EarningsBreakdownChart transactions={transactions} />
            </div>
          </div>

          {/* Transactions */}
          <div className="mt-6 px-4 lg:px-0">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="h-4 w-4 text-[#7C8CFF]" />
              <h2 className="text-sm font-bold">Transaction History</h2>
            </div>

            <FilterChips
              filters={['ALL', 'DEPOSIT', 'WITHDRAWAL', 'STAKE_DEBIT', 'WINNING_CREDIT', 'STAKE_REFUND']}
              selectedFilter={transactionFilter.type || 'ALL'}
              onFilterChange={handleFilterChange}
            />

            {isTransactionsLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/10 border-t-[#00FFB2]" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Receipt className="h-6 w-6 text-white/30" />
                </div>
                <p className="text-sm text-white/40">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2.5 mt-4">
                {transactions.map((transaction) => (
                  <TransactionItem key={transaction._id} transaction={transaction} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
