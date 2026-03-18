'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Camera, User } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { StreamingAccountCard } from '@/components/profile/StreamingAccountCard';
import { toast } from 'sonner';

export default function EditProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { profile, updateProfile, isUpdating, refetch } = useUser(user?._id);

  const displayProfile = profile || user;

  const [firstName, setFirstName] = useState(displayProfile?.firstName || '');
  const [lastName, setLastName] = useState(displayProfile?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(displayProfile?.phoneNumber || '');

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-blue-600" />
          </button>
          <h1 className="text-lg font-semibold text-black">Edit Profile</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="pb-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-8 bg-gray-50">
          {displayProfile?.profileImage ? (
            <Image
              src={displayProfile.profileImage}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full border-3 border-blue-600 mb-4"
            />
          ) : (
            <div className="w-[100px] h-[100px] rounded-full bg-white border-3 border-blue-600 flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-blue-600" />
            </div>
          )}
          <button className="flex items-center gap-1.5 text-blue-600">
            <Camera className="h-5 w-5" />
            <span className="text-[15px] font-semibold">Change Photo</span>
          </button>
        </div>

        {/* Personal Information */}
        <div className="px-4 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayProfile?.displayName || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Display name cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={displayProfile?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number (e.g., +234...)"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              {displayProfile?.phoneVerified ? (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span>✓</span> Phone number verified
                </p>
              ) : phoneNumber ? (
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <span>⚠</span> Phone number not verified - Required to witness matches
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Add phone number to become eligible as a witness</p>
              )}
            </div>
          </div>
        </div>

        {/* Streaming Accounts */}
        <div className="px-4 mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Streaming Accounts</h2>
          <p className="text-sm text-gray-500 mb-4">
            Connect your streaming accounts to verify your channels
          </p>

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
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-base hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
