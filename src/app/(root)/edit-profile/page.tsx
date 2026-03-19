'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Camera, User, RefreshCw, Radio } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { StreamingAccountCard } from '@/components/profile/StreamingAccountCard';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export default function EditProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { profile, updateProfile, isUpdating, refetch } = useUser(user?._id);

  const displayProfile = profile || user;

  const [firstName, setFirstName] = useState(displayProfile?.firstName || '');
  const [lastName, setLastName] = useState(displayProfile?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(displayProfile?.phoneNumber || '');

  // Streaming status query
  const { data: streamingStatusData, refetch: refetchStreamingStatus, isFetching: isCheckingStream } = useQuery({
    queryKey: ['user-streaming-status'],
    queryFn: () => userService.checkStreamingStatus(),
    enabled: !!user,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const streamingStatus = streamingStatusData?.data;

  // Update state when profile data loads
  useEffect(() => {
    if (displayProfile) {
      setFirstName(displayProfile.firstName || '');
      setLastName(displayProfile.lastName || '');
      setPhoneNumber(displayProfile.phoneNumber || '');
    }
  }, [displayProfile?.firstName, displayProfile?.lastName, displayProfile?.phoneNumber]);

  // Handle OAuth callback
  useEffect(() => {
    const youtube = searchParams.get('youtube');
    const twitch = searchParams.get('twitch');
    const error = searchParams.get('error');

    const handleSuccess = async (platform: string) => {
      toast.success(`${platform} connected successfully!`);
      // Refresh user data to show updated streaming account
      const result = await refetch();
      console.log('Refetch result:', result);
      console.log('Profile after refetch:', profile);
      console.log('DisplayProfile streaming accounts:', displayProfile?.streamingAccounts);
      // Clean up URL
      router.replace('/edit-profile', { scroll: false });
    };

    if (youtube === 'success') {
      handleSuccess('YouTube');
    } else if (twitch === 'success') {
      handleSuccess('Twitch');
    } else if (error) {
      const errorMessages: Record<string, string> = {
        missing_params: 'OAuth failed: Missing parameters',
        no_channel: 'No YouTube channel found',
        youtube_auth_failed: 'YouTube authentication failed',
        no_twitch_user: 'No Twitch user found',
        twitch_auth_failed: 'Twitch authentication failed',
      };
      toast.error(errorMessages[error] || 'Connection failed');
      // Clean up URL
      router.replace('/edit-profile', { scroll: false });
    }
  }, [searchParams, refetch, router]);

  const handleSave = async () => {
    const updates: any = {};

    if (firstName !== displayProfile?.firstName) {
      updates.firstName = firstName;
    }
    if (lastName !== displayProfile?.lastName) {
      updates.lastName = lastName;
    }
    if (phoneNumber !== displayProfile?.phoneNumber) {
      updates.phoneNumber = phoneNumber;
    }

    if (Object.keys(updates).length > 0) {
      try {
        await updateProfile(updates);
        setTimeout(() => router.back(), 500);
      } catch {
        // Error handled in hook
      }
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
        <div className="flex items-center gap-3 h-12 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--ultra-text)' }} />
          </button>
          <h1 className="text-base font-bold" style={{ color: 'var(--ultra-text)' }}>Edit Profile</h1>
        </div>
      </div>

      <div className="pb-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-6">
          {displayProfile?.profileImage ? (
            <Image
              src={displayProfile.profileImage}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-2xl mb-3"
              style={{ border: '3px solid var(--ultra-primary)' }}
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-3" style={{ border: '3px solid var(--ultra-primary)' }}>
              <User className="h-8 w-8" style={{ color: 'var(--ultra-primary)' }} />
            </div>
          )}
          <button className="flex items-center gap-1.5" style={{ color: 'var(--ultra-primary)' }}>
            <Camera className="h-4 w-4" />
            <span className="text-xs font-semibold">Change Photo</span>
          </button>
        </div>

        {/* Personal Information */}
        <div className="px-4">
          <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--ultra-text)' }}>Personal Information</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--ultra-text-secondary)' }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-3 py-2.5 bg-white rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2"
                style={{ border: '1px solid var(--ultra-border)', color: 'var(--ultra-text)' } as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--ultra-text-secondary)' }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-3 py-2.5 bg-white rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2"
                style={{ border: '1px solid var(--ultra-border)', color: 'var(--ultra-text)' } as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--ultra-text-secondary)' }}>
                Display Name
              </label>
              <input
                type="text"
                value={displayProfile?.displayName || ''}
                disabled
                className="w-full px-3 py-2.5 rounded-xl text-sm cursor-not-allowed"
                style={{ background: 'var(--ultra-bg)', border: '1px solid var(--ultra-border)', color: 'var(--ultra-text-muted)' }}
              />
              <p className="text-[10px] mt-1" style={{ color: 'var(--ultra-text-muted)' }}>Display name cannot be changed</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--ultra-text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={displayProfile?.email || ''}
                disabled
                className="w-full px-3 py-2.5 rounded-xl text-sm cursor-not-allowed"
                style={{ background: 'var(--ultra-bg)', border: '1px solid var(--ultra-border)', color: 'var(--ultra-text-muted)' }}
              />
              <p className="text-[10px] mt-1" style={{ color: 'var(--ultra-text-muted)' }}>Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--ultra-text-secondary)' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number (e.g., +234...)"
                className="w-full px-3 py-2.5 bg-white rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2"
                style={{ border: '1px solid var(--ultra-border)', color: 'var(--ultra-text)' } as React.CSSProperties}
              />
              {displayProfile?.phoneVerified ? (
                <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: '#059669' }}>
                  <span>✓</span> Phone number verified
                </p>
              ) : phoneNumber ? (
                <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: '#D97706' }}>
                  <span>⚠</span> Not verified - Required to witness matches
                </p>
              ) : (
                <p className="text-[10px] mt-1" style={{ color: 'var(--ultra-text-muted)' }}>Add phone number to become eligible as a witness</p>
              )}
            </div>
          </div>
        </div>

        {/* Streaming Accounts */}
        <div className="px-4 mt-6">
          <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--ultra-text)' }}>Streaming Accounts</h2>
          <p className="text-[11px] mb-3" style={{ color: 'var(--ultra-text-muted)' }}>
            Connect your streaming accounts to verify your channels
          </p>

          {/* Live Streaming Status */}
          {streamingStatus && (
            <div className="mb-3 rounded-xl p-3" style={{
              background: streamingStatus.isLive ? '#ECFDF5' : 'var(--ultra-bg)',
              border: streamingStatus.isLive ? '1px solid #A7F3D0' : '1px solid var(--ultra-border)',
            }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4" style={{ color: streamingStatus.isLive ? '#059669' : 'var(--ultra-text-muted)' }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--ultra-text)' }}>
                      {streamingStatus.isLive ? 'You are LIVE' : 'Not Streaming'}
                    </p>
                    {streamingStatus.isLive && streamingStatus.platform && (
                      <p className="text-[10px] capitalize" style={{ color: 'var(--ultra-text-secondary)' }}>
                        on {streamingStatus.platform}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    refetchStreamingStatus();
                    toast.success('Checking streaming status...');
                  }}
                  disabled={isCheckingStream}
                  className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh streaming status"
                >
                  <RefreshCw className={`h-4 w-4 ${isCheckingStream ? 'animate-spin' : ''}`} style={{ color: 'var(--ultra-text-muted)' }} />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <StreamingAccountCard
              platform="youtube"
              isConnected={!!displayProfile?.streamingAccounts?.youtube?.verified}
              channelName={displayProfile?.streamingAccounts?.youtube?.channelName ?? undefined}
              channelUrl={displayProfile?.streamingAccounts?.youtube?.channelUrl ?? undefined}
              profileImage={displayProfile?.streamingAccounts?.youtube?.profileImage ?? undefined}
              subscriberCount={displayProfile?.streamingAccounts?.youtube?.subscriberCount}
            />
            <StreamingAccountCard
              platform="twitch"
              isConnected={!!displayProfile?.streamingAccounts?.twitch?.verified}
              channelName={displayProfile?.streamingAccounts?.twitch?.channelName ?? undefined}
              channelUrl={displayProfile?.streamingAccounts?.twitch?.channelUrl ?? undefined}
              profileImage={displayProfile?.streamingAccounts?.twitch?.profileImage ?? undefined}
              followerCount={displayProfile?.streamingAccounts?.twitch?.followerCount}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="px-4 mt-6">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="w-full py-3 text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition-colors"
            style={{ background: 'var(--ultra-primary)' }}
          >
            {isUpdating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
