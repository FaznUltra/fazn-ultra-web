'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Users, Video, Trophy, Bell, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatsGrid } from '@/components/profile/StatsGrid';
import { MenuItem } from '@/components/profile/MenuItem';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, isProfileLoading, refetchProfile } = useUser(user?._id);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchProfile();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (isProfileLoading && !profile && !refreshing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayProfile = profile || user;

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Profile Header */}
      <ProfileHeader
        displayName={displayProfile?.displayName || '@username'}
        firstName={displayProfile?.firstName || ''}
        lastName={displayProfile?.lastName || ''}
        email={displayProfile?.email || ''}
        profileImage={displayProfile?.profileImage || displayProfile?.profilePicture || null}
        isVerified={displayProfile?.isVerified || false}
        onEditPress={() => router.push('/edit-profile')}
      />

      {/* Stats Grid */}
      <div className="mt-2">
        <StatsGrid
          totalChallenges={displayProfile?.stats?.totalChallenges || 0}
          wins={displayProfile?.stats?.wins || 0}
          losses={displayProfile?.stats?.losses || 0}
          draws={displayProfile?.stats?.draws || 0}
          totalEarnings={displayProfile?.stats?.totalEarnings || 0}
        />
      </div>

      {/* Menu Items */}
      <div className="bg-white mt-2">
        <MenuItem
          icon={Wallet}
          iconColor="#007AFF"
          title="Wallet"
          subtitle="Manage your funds & transactions"
          onPress={() => router.push('/wallet')}
        />
        <MenuItem
          icon={Users}
          iconColor="#34C759"
          title="Friends"
          subtitle="Manage your friends & connections"
          onPress={() => router.push('/friends')}
        />
        <MenuItem
          icon={Video}
          iconColor="#FF3B30"
          title="Streaming Accounts"
          subtitle="Connect YouTube & Twitch"
          onPress={() => router.push('/edit-profile')}
        />
        <MenuItem
          icon={Trophy}
          iconColor="#FF9500"
          title="Challenge History"
          subtitle="View your past challenges"
          onPress={() => router.push('/challenge-history')}
        />
        <MenuItem
          icon={Bell}
          iconColor="#5856D6"
          title="Notifications"
          subtitle="Manage your notifications"
          onPress={() => router.push('/notifications')}
        />
        <MenuItem
          icon={HelpCircle}
          iconColor="#34C759"
          title="Help & Support"
          subtitle="Get help with your account"
          onPress={() => router.push('/help-support')}
        />
      </div>

      {/* Logout Button */}
      <div className="px-5 mt-8 mb-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 py-4 bg-white rounded-xl border-[1.5px] border-red-500 shadow-sm active:bg-red-50 transition-colors"
        >
          <LogOut className="h-[22px] w-[22px] text-red-500" />
          <span className="text-base font-semibold text-red-500">Log Out</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-xs text-gray-300">Ultra v1.0.0</p>
      </div>
    </div>
  );
}
