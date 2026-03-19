'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus } from 'lucide-react';
import { useFriendship } from '@/hooks/useFriendship';
import { FriendCard } from '@/components/friends/FriendCard';
import { FriendRequestCard } from '@/components/friends/FriendRequestCard';

type TabType = 'friends' | 'requests' | 'sent';

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
      case 'friends':
        return friends;
      case 'requests':
        return pendingRequests;
      case 'sent':
        return sentRequests;
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'friends':
        return isFriendsLoading;
      case 'requests':
        return isPendingLoading;
      case 'sent':
        return isSentLoading;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
        <div className="flex items-center justify-between h-12 px-4">
          <h1 className="text-base font-bold" style={{ color: 'var(--ultra-text)' }}>Friends</h1>
          <button
            onClick={() => router.push('/search-users')}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors"
            style={{ background: 'var(--ultra-primary)', color: 'white' }}
          >
            <UserPlus className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
          {(['friends', 'requests', 'sent'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors capitalize relative"
              style={{
                color: activeTab === tab ? 'var(--ultra-primary)' : 'var(--ultra-text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--ultra-primary)' : '2px solid transparent',
              }}
            >
              {tab}
              {tab === 'requests' && pendingRequests.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white rounded-full" style={{ background: '#DC2626' }}>
                  {pendingRequests.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {getCurrentLoading() ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
          </div>
        ) : getCurrentData().length === 0 ? (
          <div className="text-center py-16">
            <div className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--ultra-primary-light)' }}>
              <Search className="h-5 w-5" style={{ color: 'var(--ultra-primary)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--ultra-text-secondary)' }}>
              {activeTab === 'friends' && 'No friends yet'}
              {activeTab === 'requests' && 'No pending requests'}
              {activeTab === 'sent' && 'No sent requests'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {getCurrentData().map((item) => {
              if (activeTab === 'friends') {
                return <FriendCard key={item._id} friendship={item} onUnfriend={unfriend} />;
              } else {
                return (
                  <FriendRequestCard
                    key={item._id}
                    friendship={item}
                    type={activeTab}
                    onAccept={acceptFriendRequest}
                    onReject={rejectFriendRequest}
                  />
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
