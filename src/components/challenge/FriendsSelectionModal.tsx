'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search, UserPlus, Users as UsersIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { friendshipService, Friendship } from '@/services/friendship.service';
import Image from 'next/image';

interface FriendsSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFriend: (friendId: string, friendName: string) => void;
}

export function FriendsSelectionModal({ isOpen, onClose, onSelectFriend }: FriendsSelectionModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: friendsData, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: friendshipService.getFriends,
    enabled: isOpen,
  });

  const friends = friendsData?.data?.friends || [];

  // Filter friends based on search query
  const filteredFriends = friends.filter((friendship: Friendship) => {
    const friend = friendship.requester._id !== friendship.recipient._id 
      ? friendship.recipient 
      : friendship.requester;
    return friend.displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectFriend = (friendship: Friendship) => {
    const friend = friendship.requester._id !== friendship.recipient._id 
      ? friendship.recipient 
      : friendship.requester;
    onSelectFriend(friend._id, friend.displayName);
    onClose();
  };

  const handleAddFriends = () => {
    onClose();
    router.push('/search-users');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full sm:max-w-lg bg-[#0A0F1A] sm:rounded-3xl border border-white/10 shadow-2xl max-h-[85vh] sm:max-h-[600px] flex flex-col"
        style={{ 
          background: 'linear-gradient(180deg, #0A0F1A 0%, #050709 100%)',
          borderTop: '1px solid rgba(0,255,178,0.2)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Select Friend</h2>
            <p className="text-xs text-white/50 mt-1">Choose who to challenge</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5 text-white/70" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search friends..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 focus:border-[#00FFB2]/50 transition-all"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/10 border-t-[#00FFB2]" />
            </div>
          ) : friends.length === 0 ? (
            // Empty State - No Friends
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(124,140,255,0.1)' }}
              >
                <UsersIcon className="h-10 w-10 text-[#7C8CFF]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Friends Yet</h3>
              <p className="text-sm text-white/50 text-center mb-6 max-w-xs">
                You haven't added any friends yet. Add friends to challenge them directly!
              </p>
              <button
                onClick={handleAddFriends}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  background: 'linear-gradient(135deg, #00FFB2 0%, #00D99A 100%)',
                  color: '#05070b'
                }}
              >
                <UserPlus className="h-4 w-4" />
                Add Friends
              </button>
            </div>
          ) : filteredFriends.length === 0 ? (
            // No Search Results
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <Search className="h-8 w-8 text-white/30" />
              </div>
              <p className="text-sm text-white/50 text-center">
                No friends found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            // Friends List
            <div className="p-4 space-y-2">
              {filteredFriends.map((friendship: Friendship) => {
                const friend = friendship.requester._id !== friendship.recipient._id 
                  ? friendship.recipient 
                  : friendship.requester;
                
                return (
                  <button
                    key={friendship._id}
                    onClick={() => handleSelectFriend(friendship)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-white/5 border border-transparent hover:border-[#00FFB2]/30 group"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/5 flex-shrink-0">
                      {friend.profileImage ? (
                        <Image
                          src={friend.profileImage}
                          alt={friend.displayName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40 font-bold text-lg">
                          {friend.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white group-hover:text-[#00FFB2] transition-colors">
                          {friend.displayName}
                        </p>
                        {friend.isVerified && (
                          <div className="w-4 h-4 rounded-full bg-[#00FFB2] flex items-center justify-center">
                            <span className="text-[#05070b] text-[10px] font-bold">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-white/40">{friend.email}</p>
                    </div>
                    <div className="text-xs text-[#00FFB2] opacity-0 group-hover:opacity-100 transition-opacity">
                      Select →
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Add Friends Button (shown when there are friends) */}
        {friends.length > 0 && (
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleAddFriends}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#00FFB2]/30"
            >
              <UserPlus className="h-4 w-4" />
              Add More Friends
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
