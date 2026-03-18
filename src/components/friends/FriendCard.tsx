'use client';

import { User, MoreVertical } from 'lucide-react';
import { Friendship } from '@/services/friendship.service';

interface FriendCardProps {
  friendship: Friendship;
  onUnfriend: (userId: string) => void;
}

export function FriendCard({ friendship, onUnfriend }: FriendCardProps) {
  const friend = friendship.recipient._id === friendship.requester._id ? friendship.recipient : friendship.recipient;

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
        <User className="h-6 w-6 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{friend.displayName}</p>
        <p className="text-xs text-gray-500 truncate">{friend.email}</p>
      </div>
      <button
        onClick={() => onUnfriend(friend._id)}
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
}
