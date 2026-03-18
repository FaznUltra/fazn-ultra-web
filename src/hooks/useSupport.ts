import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '@/services/support.service';
import { toast } from 'sonner';

export function useSupport(params?: { status?: string; limit?: number; page?: number }) {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['support-tickets', params],
    queryFn: () => supportService.getSupportTickets(params),
  });

  const createTicketMutation = useMutation({
    mutationFn: (data: { subject: string; category: string; message: string }) =>
      supportService.createSupportTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast.success('Support ticket created successfully');
    },
    onError: () => {
      toast.error('Failed to create support ticket');
    },
  });

  return {
    tickets: data?.data?.tickets || [],
    isLoading,
    refetch,
    createTicket: createTicketMutation.mutate,
    isCreating: createTicketMutation.isPending,
  };
}

export function useSupportTicket(ticketId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['support-ticket', ticketId],
    queryFn: () => supportService.getTicketById(ticketId),
    enabled: !!ticketId,
  });

  const addMessageMutation = useMutation({
    mutationFn: (message: string) => supportService.addMessageToTicket(ticketId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast.success('Message sent');
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });

  const closeTicketMutation = useMutation({
    mutationFn: () => supportService.closeTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast.success('Ticket closed');
    },
    onError: () => {
      toast.error('Failed to close ticket');
    },
  });

  return {
    ticket: data?.data?.ticket,
    isLoading,
    refetch,
    addMessage: addMessageMutation.mutate,
    isSendingMessage: addMessageMutation.isPending,
    closeTicket: closeTicketMutation.mutate,
    isClosing: closeTicketMutation.isPending,
  };
}
