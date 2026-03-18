import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface Currency {
  code: string;
  balance: number;
  isActive: boolean;
}

export interface WalletData {
  id: string;
  currencies: Currency[];
  totalDeposits: number;
  totalWithdrawals: number;
  totalStaked: number;
  totalWinnings: number;
}

export interface Transaction {
  _id: string;
  userId: string;
  walletId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'STAKE_DEBIT' | 'STAKE_REFUND' | 'WINNING_CREDIT' | 'PLATFORM_FEE' | 'WITNESS_REWARD';
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
  reference: string;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface InitializeDepositRequest {
  amount: number;
}

export interface InitializeDepositResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export const walletService = {
  getWallet: async (): Promise<ApiResponse<{ wallet: WalletData }>> => {
    const response = await apiClient.get('/wallet');
    return response.data;
  },

  getTransactions: async (
    page = 1,
    limit = 20,
    type?: string,
    status?: string
  ): Promise<ApiResponse<TransactionsResponse>> => {
    const response = await apiClient.get('/wallet/transactions', {
      params: { page, limit, type, status },
    });
    return response.data;
  },

  initializeDeposit: async (data: InitializeDepositRequest): Promise<ApiResponse<InitializeDepositResponse>> => {
    const response = await apiClient.post('/wallet/deposit/initialize', data);
    return response.data;
  },

  verifyDeposit: async (reference: string): Promise<ApiResponse<{ transaction: Transaction }>> => {
    const response = await apiClient.get(`/wallet/deposit/verify/${reference}`);
    return response.data;
  },

  getTransactionAnalytics: async (period: string = '7d'): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/wallet/transactions/analytics`, { params: { period } });
    return response.data;
  },
};
