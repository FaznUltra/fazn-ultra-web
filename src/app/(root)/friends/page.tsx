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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-bold text-gray-900">Friends</h1>
          <button
            onClick={() => router.push('/search-users')}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <UserPlus className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'friends'
                ? 'text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Friends
            {activeTab === 'friends' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'requests'
                ? 'text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Requests
            {pendingRequests.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {pendingRequests.length}
              </span>
            )}
            {activeTab === 'requests' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'sent'
                ? 'text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Sent
            {activeTab === 'sent' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {getCurrentLoading() ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : getCurrentData().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
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
