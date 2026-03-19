'use client';

import { User, Check, X } from 'lucide-react';
import { Friendship } from '@/services/friendship.service';

interface FriendRequestCardProps {
  friendship: Friendship;
  type: 'requests' | 'sent';
  onAccept?: (friendshipId: string) => void;
  onReject?: (friendshipId: string) => void;
}

export function FriendRequestCard({ friendship, type, onAccept, onReject }: FriendRequestCardProps) {
  const displayUser = type === 'requests' ? friendship.requester : friendship.recipient;

  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ultra-primary-light)' }}>
          <User className="h-4 w-4" style={{ color: 'var(--ultra-primary)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--ultra-text)' }}>{displayUser.displayName}</p>
          <p className="text-[11px] truncate" style={{ color: 'var(--ultra-text-muted)' }}>{displayUser.email}</p>
        </div>
      </div>

      {type === 'requests' && onAccept && onReject && (
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(friendship._id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-white rounded-xl font-semibold text-xs transition-colors"
            style={{ background: 'var(--ultra-primary)' }}
          >
            <Check className="h-3.5 w-3.5" />
            Accept
          </button>
          <button
            onClick={() => onReject(friendship._id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-semibold text-xs transition-colors"
            style={{ background: 'var(--ultra-bg)', color: 'var(--ultra-text-secondary)' }}
          >
            <X className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      )}

      {type === 'sent' && (
        <div className="text-center">
          <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{ background: '#FEF3C7', color: '#D97706' }}>
            Pending
          </span>
        </div>
      )}
    </div>
  );
}
