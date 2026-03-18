import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { friendshipService } from '@/services/friendship.service';
import { toast } from 'sonner';

export const useFriendship = () => {
  const queryClient = useQueryClient();

  const { data: friendsData, isLoading: isFriendsLoading, refetch: refetchFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: friendshipService.getFriends,
  });

  const { data: pendingRequestsData, isLoading: isPendingLoading, refetch: refetchPending } = useQuery({
    queryKey: ['pending-requests'],
    queryFn: friendshipService.getPendingRequests,
  });

  const { data: sentRequestsData, isLoading: isSentLoading, refetch: refetchSent } = useQuery({
    queryKey: ['sent-requests'],
    queryFn: friendshipService.getSentRequests,
  });

  const sendRequestMutation = useMutation({
    mutationFn: friendshipService.sendFriendRequest,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Friend Request Sent', {
          description: 'Your friend request has been sent',
        });
        queryClient.invalidateQueries({ queryKey: ['sent-requests'] });
      }
    },
    onError: (error: any) => {
      toast.error('Failed to Send Request', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: friendshipService.acceptFriendRequest,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Friend Request Accepted', {
          description: 'You are now friends!',
        });
        queryClient.invalidateQueries({ queryKey: ['friends'] });
        queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      }
    },
    onError: (error: any) => {
      toast.error('Failed to Accept Request', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: friendshipService.rejectFriendRequest,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Friend Request Rejected');
        queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      }
    },
    onError: (error: any) => {
      toast.error('Failed to Reject Request', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const unfriendMutation = useMutation({
    mutationFn: friendshipService.unfriend,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Friend Removed');
        queryClient.invalidateQueries({ queryKey: ['friends'] });
      }
    },
    onError: (error: any) => {
      toast.error('Failed to Remove Friend', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  return {
    friends: friendsData?.data?.friends || [],
    isFriendsLoading,
    refetchFriends,
    pendingRequests: pendingRequestsData?.data?.requests || [],
    isPendingLoading,
    refetchPending,
    sentRequests: sentRequestsData?.data?.requests || [],
    isSentLoading,
    refetchSent,
    sendFriendRequest: (recipientId: string) => sendRequestMutation.mutate(recipientId),
    isSendingRequest: sendRequestMutation.isPending,
    acceptFriendRequest: (friendshipId: string) => acceptRequestMutation.mutate(friendshipId),
    isAcceptingRequest: acceptRequestMutation.isPending,
    rejectFriendRequest: (friendshipId: string) => rejectRequestMutation.mutate(friendshipId),
    isRejectingRequest: rejectRequestMutation.isPending,
    unfriend: (userId: string) => unfriendMutation.mutate(userId),
    isUnfriending: unfriendMutation.isPending,
  };
};

export const useUserSearch = (query: string) => {
  return useQuery({
    queryKey: ['user-search', query],
    queryFn: () => friendshipService.searchUsers(query),
    enabled: query.length > 0,
  });
};
