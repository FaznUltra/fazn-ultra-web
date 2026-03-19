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
    <div className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ultra-primary-light)' }}>
        <User className="h-4 w-4" style={{ color: 'var(--ultra-primary)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--ultra-text)' }}>{friend.displayName}</p>
        <p className="text-[11px] truncate" style={{ color: 'var(--ultra-text-muted)' }}>{friend.email}</p>
      </div>
      <button
        onClick={() => onUnfriend(friend._id)}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
      >
        <MoreVertical className="h-4 w-4" style={{ color: 'var(--ultra-text-muted)' }} />
      </button>
    </div>
  );
}
