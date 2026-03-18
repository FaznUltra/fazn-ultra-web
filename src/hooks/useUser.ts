import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, UpdateProfileRequest } from '@/services/user.service';
import { toast } from 'sonner';

export const useUser = (userId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => userService.getProfile(userId!),
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Profile Updated!', {
          description: 'Your profile has been updated successfully',
        });

        // Invalidate all user-related queries
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    },
    onError: (error: any) => {
      toast.error('Update Failed', {
        description: error.response?.data?.message || 'Failed to update profile',
      });
    },
  });

  return {
    profile: profileData?.data?.user,
    isProfileLoading,
    profileError,
    refetch: refetchProfile,
    updateProfile: (data: UpdateProfileRequest) => updateProfileMutation.mutateAsync(data),
    isUpdating: updateProfileMutation.isPending,
  };
};
