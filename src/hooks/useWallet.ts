import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService, InitializeDepositRequest } from '@/services/wallet.service';
import { toast } from 'sonner';
import { useState } from 'react';

export const useWallet = (analyticsPeriod: string = '7d') => {
  const queryClient = useQueryClient();
  const [transactionFilter, setTransactionFilter] = useState<{
    type?: string;
    status?: string;
    page?: number;
  }>({});

  const { data: walletData, isLoading: isWalletLoading, refetch: refetchWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: walletService.getWallet,
  });

  const { data: transactionsData, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ['transactions', transactionFilter],
    queryFn: () =>
      walletService.getTransactions(
        transactionFilter.page || 1,
        20,
        transactionFilter.type,
        transactionFilter.status
      ),
  });

  const { data: analyticsData, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['transaction-analytics', analyticsPeriod],
    queryFn: () => walletService.getTransactionAnalytics(analyticsPeriod),
  });

  const initializeDepositMutation = useMutation({
    mutationFn: walletService.initializeDeposit,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Payment Initialized', {
          description: 'Redirecting to payment gateway...',
        });
      }
    },
    onError: (error: any) => {
      toast.error('Deposit Failed', {
        description: error.response?.data?.message || 'Failed to initialize deposit',
      });
    },
  });

  const verifyDepositMutation = useMutation({
    mutationFn: walletService.verifyDeposit,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Deposit Successful!', {
          description: 'Your wallet has been credited',
        });

        queryClient.invalidateQueries({ queryKey: ['wallet'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      }
    },
    onError: (error: any) => {
      toast.error('Verification Failed', {
        description: error.response?.data?.message || 'Failed to verify deposit',
      });
    },
  });

  return {
    wallet: walletData?.data?.wallet,
    isWalletLoading,
    refetchWallet,
    transactions: transactionsData?.data?.transactions || [],
    pagination: transactionsData?.data?.pagination,
    isTransactionsLoading,
    refetchTransactions,
    analytics: analyticsData?.data,
    isAnalyticsLoading,
    refetchAnalytics,
    setTransactionFilter,
    transactionFilter,
    initializeDeposit: (data: InitializeDepositRequest) => initializeDepositMutation.mutateAsync(data),
    isInitializingDeposit: initializeDepositMutation.isPending,
    verifyDeposit: (reference: string) => verifyDepositMutation.mutate(reference),
    isVerifyingDeposit: verifyDepositMutation.isPending,
  };
};
