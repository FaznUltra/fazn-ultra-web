'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Camera, User, RefreshCw, Radio, UserCircle, Video } from 'lucide-react';
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
      await refetch();
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
    <div className="min-h-screen bg-[#03060b] text-white pb-24 lg:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5" style={{ background: 'rgba(3,6,11,0.8)' }}>
        <div className="flex items-center gap-3 h-14 px-4">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
          <h1 className="text-base font-bold">Edit Profile</h1>
        </div>
      </div>

      <div className="pb-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#131A31]/20 to-transparent" />
          <div className="relative">
            {displayProfile?.profileImage ? (
              <div className="relative">
                <Image
                  src={displayProfile.profileImage}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="rounded-3xl"
                  style={{ border: '3px solid #00FFB2' }}
                />
                <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: '0 0 40px rgba(0,255,178,0.3)' }} />
              </div>
            ) : (
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(0,255,178,0.12)', border: '3px solid #00FFB2' }}>
                  <User className="h-10 w-10 text-[#00FFB2]" />
                </div>
                <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: '0 0 40px rgba(0,255,178,0.3)' }} />
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full transition-all hover:scale-[1.02]" style={{ background: 'rgba(0,255,178,0.12)', color: '#00FFB2', border: '1px solid rgba(0,255,178,0.2)' }}>
            <Camera className="h-4 w-4" />
            <span className="text-xs font-semibold">Change Photo</span>
          </button>
        </div>

        {/* Personal Information */}
        <div className="px-4">
          <div className="flex items-center gap-2 mb-4">
            <UserCircle className="h-4 w-4 text-[#00FFB2]" />
            <h2 className="text-sm font-bold">Personal Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 text-white/60">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 focus:border-[#00FFB2]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-white/60">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 focus:border-[#00FFB2]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-white/60">
                Display Name
              </label>
              <input
                type="text"
                value={displayProfile?.displayName || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl text-sm cursor-not-allowed bg-white/[0.02] border border-white/5 text-white/40"
              />
              <p className="text-[10px] mt-1.5 text-white/30">Display name cannot be changed</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-white/60">
                Email
              </label>
              <input
                type="email"
                value={displayProfile?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl text-sm cursor-not-allowed bg-white/[0.02] border border-white/5 text-white/40"
              />
              <p className="text-[10px] mt-1.5 text-white/30">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-white/60">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number (e.g., +234...)"
                className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 focus:border-[#00FFB2]/50 transition-all"
              />
              {displayProfile?.phoneVerified ? (
                <p className="text-[10px] mt-1.5 flex items-center gap-1 text-[#00FFB2]">
                  <span>✓</span> Phone number verified
                </p>
              ) : phoneNumber ? (
                <p className="text-[10px] mt-1.5 flex items-center gap-1 text-[#FBCB4A]">
                  <span>⚠</span> Not verified - Required to witness matches
                </p>
              ) : (
                <p className="text-[10px] mt-1.5 text-white/30">Add phone number to become eligible as a witness</p>
              )}
            </div>
          </div>
        </div>

        {/* Streaming Accounts */}
        <div className="px-4 mt-6">
          <div className="flex items-center gap-2 mb-1">
            <Video className="h-4 w-4 text-[#FF6B6B]" />
            <h2 className="text-sm font-bold">Streaming Accounts</h2>
          </div>
          <p className="text-xs mb-4 text-white/50">
            Connect your streaming accounts to verify your channels
          </p>

          {/* Live Streaming Status */}
          {streamingStatus && (
            <div className="mb-4 rounded-2xl p-4 border" style={{
              background: streamingStatus.isLive ? 'rgba(255,107,107,0.08)' : 'rgba(255,255,255,0.02)',
              borderColor: streamingStatus.isLive ? 'rgba(255,107,107,0.3)' : 'rgba(255,255,255,0.05)',
            }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Radio className="h-4 w-4" style={{ color: streamingStatus.isLive ? '#FF6B6B' : 'rgba(255,255,255,0.3)' }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: streamingStatus.isLive ? '#FF6B6B' : 'white' }}>
                      {streamingStatus.isLive ? 'You are LIVE' : 'Not Streaming'}
                    </p>
                    {streamingStatus.isLive && streamingStatus.platform && (
                      <p className="text-[10px] capitalize text-white/50">
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
                  className="p-2 rounded-lg transition-all hover:bg-white/5 disabled:opacity-50"
                  title="Refresh streaming status"
                >
                  <RefreshCw className={`h-4 w-4 ${isCheckingStream ? 'animate-spin' : ''} text-white/50`} />
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
        <div className="px-4 mt-8">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="w-full py-3.5 rounded-2xl font-bold text-sm disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: '#00FFB2', color: '#05070b' }}
          >
            {isUpdating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#05070b]/20 border-t-[#05070b]"></div>
                <span>Saving Changes...</span>
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
