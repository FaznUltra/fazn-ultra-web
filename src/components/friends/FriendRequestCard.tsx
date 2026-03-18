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
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{displayUser.displayName}</p>
          <p className="text-xs text-gray-500 truncate">{displayUser.email}</p>
        </div>
      </div>

      {type === 'requests' && onAccept && onReject && (
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(friendship._id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            <Check className="h-4 w-4" />
            Accept
          </button>
          <button
            onClick={() => onReject(friendship._id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
            Reject
          </button>
        </div>
      )}

      {type === 'sent' && (
        <div className="text-center">
          <span className="text-xs px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 font-semibold">
            Pending
          </span>
        </div>
      )}
    </div>
  );
}
