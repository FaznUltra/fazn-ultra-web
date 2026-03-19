'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus } from 'lucide-react';
import { useFriendship } from '@/hooks/useFriendship';
import { FriendCard } from '@/components/friends/FriendCard';
import { FriendRequestCard } from '@/components/friends/FriendRequestCard';

type TabType = 'friends' | 'requests' | 'sent';

const tabs: { key: TabType; label: string }[] = [
  { key: 'friends', label: 'Friends' },
  { key: 'requests', label: 'Requests' },
  { key: 'sent', label: 'Sent' },
];

export default function FriendsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const {
    friends,
    isFriendsLoading,
    pendingRequests,
    isPendingLoading,
    sentRequests,
    isSentLoading,
    acceptFriendRequest,
    rejectFriendRequest,
    unfriend,
  } = useFriendship();

  const getCurrentData = () => {
    switch (activeTab) {
      case 'friends':   return friends;
      case 'requests':  return pendingRequests;
      case 'sent':      return sentRequests;
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'friends':   return isFriendsLoading;
      case 'requests':  return isPendingLoading;
      case 'sent':      return isSentLoading;
    }
  };

  const emptyMessages: Record<TabType, string> = {
    friends:  'No friends yet. Add someone!',
    requests: 'No pending requests',
    sent:     'No sent requests',
  };

  const data = getCurrentData();
  const isLoading = getCurrentLoading();

  return (
    <div className="min-h-screen bg-[#03060b] text-white pb-24">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 border-b border-white/[0.05] bg-[#03060b]/80 backdrop-blur-lg">
        <div className="flex items-center justify-between h-14 px-4">
          <div>
            <h1 className="text-base font-bold leading-none">Friends</h1>
          </div>
          <button
            onClick={() => router.push('/search-users')}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{ background: '#00FFB2' }}
          >
            <UserPlus className="h-4 w-4" style={{ color: '#05070b' }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1 pb-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const showBadge = tab.key === 'requests' && pendingRequests.length > 0;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all"
                style={{
                  background: isActive ? '#00FFB2' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#05070b' : 'rgba(255,255,255,0.45)',
                  border: isActive ? '1px solid #00FFB2' : '1px solid transparent',
                }}
              >
                {tab.label}
                {showBadge && (
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-black rounded-full"
                    style={{
                      background: isActive ? '#05070b' : '#FF6B6B',
                      color: isActive ? '#00FFB2' : '#fff',
                    }}
                  >
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div
              className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10"
              style={{ borderTopColor: '#00FFB2' }}
            />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div
              className="mx-auto h-14 w-14 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(0,255,178,0.08)' }}
            >
              <Search className="h-5 w-5" style={{ color: '#00FFB2' }} />
            </div>
            <p className="text-sm font-semibold text-white/40">{emptyMessages[activeTab]}</p>
            {activeTab === 'friends' && (
              <button
                onClick={() => router.push('/search-users')}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all hover:opacity-90"
                style={{ background: '#00FFB2', color: '#05070b' }}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Find People
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {data.map((item) =>
              activeTab === 'friends' ? (
                <FriendCard key={item._id} friendship={item} onUnfriend={unfriend} />
              ) : (
                <FriendRequestCard
                  key={item._id}
                  friendship={item}
                  type={activeTab as 'requests' | 'sent'}
                  onAccept={acceptFriendRequest}
                  onReject={rejectFriendRequest}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}