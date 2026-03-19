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
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4">
      {/* User row */}
      <div className="flex items-center gap-3 mb-3.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(124,140,255,0.15)' }}
        >
          <User className="h-4 w-4" style={{ color: '#7C8CFF' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate text-white">{displayUser.displayName}</p>
          <p className="text-[11px] truncate text-white/40">{displayUser.email}</p>
        </div>
        {type === 'sent' && (
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-bold flex-shrink-0"
            style={{ background: 'rgba(251,203,74,0.12)', color: '#FBCB4A' }}
          >
            Pending
          </span>
        )}
      </div>

      {/* Actions */}
      {type === 'requests' && onAccept && onReject && (
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(friendship._id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#00FFB2', color: '#05070b' }}
          >
            <Check className="h-3.5 w-3.5" />
            Accept
          </button>
          <button
            onClick={() => onReject(friendship._id)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border border-white/[0.08] hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            <X className="h-3.5 w-3.5" />
            Decline
          </button>
        </div>
      )}
    </div>
  );
}