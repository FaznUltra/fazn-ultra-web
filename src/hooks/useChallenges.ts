import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { challengeService, CreateChallengeRequest } from '@/services/challenge.service';
import { toast } from 'sonner';

export const useChallenges = () => {
  const queryClient = useQueryClient();

  const { data: gamesData, isLoading: isGamesLoading } = useQuery({
    queryKey: ['available-games'],
    queryFn: challengeService.getAvailableGames,
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['challenge-stats'],
    queryFn: challengeService.getChallengeStats,
  });

  const createChallengeMutation = useMutation({
    mutationFn: challengeService.createChallenge,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Challenge Created!', {
          description: 'Your challenge has been created successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['challenges'] });
        queryClient.invalidateQueries({ queryKey: ['challenge-stats'] });
      }
    },
    onError: (error: any) => {
      toast.error('Failed to Create Challenge', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const acceptChallengeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => challengeService.acceptChallenge(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Challenge Accepted!', {
          description: 'You have accepted the challenge',
        });
        queryClient.invalidateQueries({ queryKey: ['challenges'] });
      }
    },
    onError: (error: any) => {
      toast.error('Failed to Accept Challenge', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const rejectChallengeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => challengeService.rejectChallenge(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Challenge Rejected', {
          description: 'You have rejected the challenge',
        });
        queryClient.invalidateQueries({ queryKey: ['challenges'] });
      }
    },
    onError: (error: any) => {
      toast.error('Failed to Reject Challenge', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const cancelChallengeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => challengeService.cancelChallenge(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Challenge Cancelled', {
          description: 'The challenge has been cancelled',
        });
        queryClient.invalidateQueries({ queryKey: ['challenges'] });
      }
    },
    onError: (error: any) => {
      toast.error('Failed to Cancel Challenge', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  return {
    games: gamesData?.data?.games || [],
    isGamesLoading,
    stats: statsData?.data,
    isStatsLoading,
    createChallenge: (data: CreateChallengeRequest) => createChallengeMutation.mutateAsync(data),
    isCreatingChallenge: createChallengeMutation.isPending,
    acceptChallenge: (id: string, data?: any) => acceptChallengeMutation.mutate({ id, data }),
    isAcceptingChallenge: acceptChallengeMutation.isPending,
    rejectChallenge: (id: string, data?: any) => rejectChallengeMutation.mutate({ id, data }),
    isRejectingChallenge: rejectChallengeMutation.isPending,
    cancelChallenge: (id: string, data?: any) => cancelChallengeMutation.mutate({ id, data }),
    isCancellingChallenge: cancelChallengeMutation.isPending,
  };
};

export const useChallengeHistory = (params?: { status?: string; limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['challenge-history', params],
    queryFn: () => challengeService.getChallengeHistory(params),
  });
};

// New tab-based hooks
export const usePublicChallenges = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['public-challenges', params],
    queryFn: () => challengeService.getPublicChallenges(params),
  });
};

export const useInvitedChallenges = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['invited-challenges', params],
    queryFn: () => challengeService.getInvitedChallenges(params),
  });
};

export const useUpcomingChallenges = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['upcoming-challenges', params],
    queryFn: () => challengeService.getUpcomingChallenges(params),
  });
};

export const useLiveChallenges = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['live-challenges', params],
    queryFn: () => challengeService.getLiveChallenges(params),
  });
};

export const useFlaggedChallenges = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['flagged-challenges', params],
    queryFn: () => challengeService.getFlaggedChallenges(params),
  });
};

export const useDisputedChallenges = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['disputed-challenges', params],
    queryFn: () => challengeService.getDisputedChallenges(params),
  });
};

export const useHistoryChallenges = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['history-challenges', params],
    queryFn: () => challengeService.getHistoryChallenges(params),
  });
};

// Legacy hooks
export const useFriendsChallenges = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['friends-challenges', params],
    queryFn: () => challengeService.getFriendsChallenges(params),
  });
};

export const useChallenge = (id: string) => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: () => challengeService.getChallengeById(id),
    enabled: !!id,
  });
};

export const useWitnessingChallenges = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['witnessing-challenges', params],
    queryFn: () => challengeService.getWitnessingChallenges(params),
  });
};

export const useMyWitnessingChallenges = (params?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['my-witnessing-challenges', params],
    queryFn: () => challengeService.getMyWitnessingChallenges(params),
  });
};
