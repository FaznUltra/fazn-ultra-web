import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface SupportMessage {
  sender: 'user' | 'support';
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  _id: string;
  userId: string;
  subject: string;
  category: 'account' | 'payment' | 'challenge' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: SupportMessage[];
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
}

export const supportService = {
  getSupportTickets: async (params?: {
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<{ tickets: SupportTicket[]; pagination: any }>> => {
    const response = await apiClient.get('/support', { params });
    return response.data;
  },

  getTicketById: async (id: string): Promise<ApiResponse<{ ticket: SupportTicket }>> => {
    const response = await apiClient.get(`/support/${id}`);
    return response.data;
  },

  createSupportTicket: async (data: {
    subject: string;
    category: string;
    message: string;
  }): Promise<ApiResponse<{ ticket: SupportTicket }>> => {
    const response = await apiClient.post('/support', data);
    return response.data;
  },

  addMessageToTicket: async (
    id: string,
    message: string
  ): Promise<ApiResponse<{ ticket: SupportTicket }>> => {
    const response = await apiClient.post(`/support/${id}/message`, { message });
    return response.data;
  },

  closeTicket: async (id: string): Promise<ApiResponse<{ ticket: SupportTicket }>> => {
    const response = await apiClient.patch(`/support/${id}/close`);
    return response.data;
  },

  getTicketStats: async (): Promise<ApiResponse<TicketStats>> => {
    const response = await apiClient.get('/support/stats');
    return response.data;
  },
};
