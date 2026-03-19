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
  const { profile, isProfileLoading, refetch } = useUser(user?._id);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (isProfileLoading && !profile && !refreshing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
      </div>
    );
  }

  const displayProfile = profile || user;

  return (
    <div className="min-h-screen pb-4">
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
      <StatsGrid
        totalChallenges={displayProfile?.stats?.totalChallenges || 0}
        wins={displayProfile?.stats?.wins || 0}
        losses={displayProfile?.stats?.losses || 0}
        draws={displayProfile?.stats?.draws || 0}
        totalEarnings={displayProfile?.stats?.totalEarnings || 0}
      />

      {/* Menu Items */}
      <div className="mx-4 mt-1 bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
        <MenuItem
          icon={Wallet}
          iconColor="#4F46E5"
          title="Wallet"
          subtitle="Manage your funds & transactions"
          onPress={() => router.push('/wallet')}
        />
        <MenuItem
          icon={Users}
          iconColor="#059669"
          title="Friends"
          subtitle="Manage your friends & connections"
          onPress={() => router.push('/friends')}
        />
        <MenuItem
          icon={Video}
          iconColor="#DC2626"
          title="Streaming Accounts"
          subtitle="Connect YouTube & Twitch"
          onPress={() => router.push('/edit-profile')}
        />
        <MenuItem
          icon={Trophy}
          iconColor="#D97706"
          title="Challenge History"
          subtitle="View your past challenges"
          onPress={() => router.push('/challenge-history')}
        />
        <MenuItem
          icon={Bell}
          iconColor="#7C3AED"
          title="Notifications"
          subtitle="Manage your notifications"
          onPress={() => router.push('/notifications')}
        />
        <MenuItem
          icon={HelpCircle}
          iconColor="#059669"
          title="Help & Support"
          subtitle="Get help with your account"
          onPress={() => router.push('/help-support')}
        />
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6 mb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: '#FEF2F2', color: '#DC2626' }}
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pb-4">
        <p className="text-[10px]" style={{ color: 'var(--ultra-text-muted)' }}>Ultra v1.0.0</p>
      </div>
    </div>
  );
}
