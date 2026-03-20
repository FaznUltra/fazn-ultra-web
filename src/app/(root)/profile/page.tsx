'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Wallet, Users, Video, Trophy, Bell, HelpCircle, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatsGrid } from '@/components/profile/StatsGrid';
import { MenuItem } from '@/components/profile/MenuItem';
import { WinLossChart } from '@/components/charts/WinLossChart';
import { PerformanceTrendChart } from '@/components/charts/PerformanceTrendChart';
import { GamePerformanceChart } from '@/components/charts/GamePerformanceChart';
import { useChallengeHistory } from '@/hooks/useChallenges';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, isProfileLoading, refetch } = useUser(user?._id);
  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: historyData } = useChallengeHistory({ limit: 100 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showLogoutModal]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  if (isProfileLoading && !profile && !refreshing) {
    return (
      <div className="min-h-screen bg-[#03060b] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10 border-t-[#00FFB2]" />
      </div>
    );
  }

  const displayProfile = profile || user;

  return (
    <div className="min-h-screen bg-[#03060b] text-white pb-24 lg:pb-6">
      {/* Hero gradient background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#131A31] via-[#0B0F1B] to-[#05070C]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFB2]/10 via-transparent to-[#7C8CFF]/10" />
        
        {/* Profile Header */}
        <div className="relative">
          <ProfileHeader
            displayName={displayProfile?.displayName || '@username'}
            firstName={displayProfile?.firstName || ''}
            lastName={displayProfile?.lastName || ''}
            email={displayProfile?.email || ''}
            profileImage={displayProfile?.profileImage || displayProfile?.profilePicture || null}
            isVerified={displayProfile?.isVerified || false}
            onEditPress={() => router.push('/edit-profile')}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid
        totalChallenges={displayProfile?.stats?.totalChallenges || 0}
        wins={displayProfile?.stats?.wins || 0}
        losses={displayProfile?.stats?.losses || 0}
        draws={displayProfile?.stats?.draws || 0}
        totalEarnings={displayProfile?.stats?.totalEarnings || 0}
      />

      {/* Performance Charts */}
      <div className="px-4 mt-6 space-y-4">
        <WinLossChart
          wins={displayProfile?.stats?.wins || 0}
          losses={displayProfile?.stats?.losses || 0}
          draws={displayProfile?.stats?.draws || 0}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PerformanceTrendChart 
            challengeHistory={historyData?.data?.challenges || []}
            userId={user?._id}
          />
          <GamePerformanceChart 
            challengeHistory={historyData?.data?.challenges || []}
            userId={user?._id}
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-6 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-[#00FFB2]" />
          <h2 className="text-sm font-bold text-white/90">Quick Actions</h2>
        </div>
        
        <div className="rounded-3xl border border-white/5 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
          <MenuItem
            icon={Wallet}
            iconColor="#7C8CFF"
            title="Wallet"
            subtitle="Manage your funds & transactions"
            onPress={() => router.push('/wallet')}
          />
          <div className="h-px bg-white/5 mx-4" />
          <MenuItem
            icon={Users}
            iconColor="#00FFB2"
            title="Friends"
            subtitle="Manage your friends & connections"
            onPress={() => router.push('/friends')}
          />
          <div className="h-px bg-white/5 mx-4" />
          <MenuItem
            icon={Video}
            iconColor="#FF6B6B"
            title="Streaming Accounts"
            subtitle="Connect YouTube & Twitch"
            onPress={() => router.push('/edit-profile')}
          />
          <div className="h-px bg-white/5 mx-4" />
          <MenuItem
            icon={Trophy}
            iconColor="#FBCB4A"
            title="Challenge History"
            subtitle="View your past challenges"
            onPress={() => router.push('/challenge-history')}
          />
          <div className="h-px bg-white/5 mx-4" />
          <MenuItem
            icon={Bell}
            iconColor="#FF61D6"
            title="Notifications"
            subtitle="Manage your notifications"
            onPress={() => router.push('/notifications')}
          />
          <div className="h-px bg-white/5 mx-4" />
          <MenuItem
            icon={HelpCircle}
            iconColor="#FF9F43"
            title="Help & Support"
            subtitle="Get help with your account"
            onPress={() => router.push('/help-support')}
          />
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 border border-[#FF6B6B]/20"
          style={{ background: 'rgba(255,107,107,0.08)', color: '#FF6B6B' }}
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {mounted && showLogoutModal && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center p-4" 
          style={{ 
            background: 'rgba(0,0,0,0.85)',
            zIndex: 999999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#0F1523' }}>
            <h3 className="text-xl font-bold text-white mb-2">Log Out?</h3>
            <p className="text-white/60 text-sm mb-6">Are you sure you want to log out of your account?</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: '#FF6B6B', color: 'white' }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Footer */}
      <div className="text-center mt-8 pb-4">
        <p className="text-[10px] text-white/30">FAZN Ultra v1.0.0</p>
      </div>
    </div>
  );
}
