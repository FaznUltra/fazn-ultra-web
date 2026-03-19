'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, User, UserPlus } from 'lucide-react';
import { useUserSearch } from '@/hooks/useFriendship';
import { useFriendship } from '@/hooks/useFriendship';

export default function SearchUsersPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { data: searchResults, isLoading } = useUserSearch(query);
  const { sendFriendRequest, isSendingRequest } = useFriendship();

  const users = searchResults?.data?.users || [];

  const handleSendRequest = (userId: string) => {
    sendFriendRequest(userId);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
        <div className="flex items-center gap-3 h-12 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--ultra-text)' }} />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--ultra-text-muted)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
              style={{ background: 'var(--ultra-bg)', border: '1px solid var(--ultra-border)' } as React.CSSProperties}
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {query.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--ultra-primary-light)' }}>
              <Search className="h-5 w-5" style={{ color: 'var(--ultra-primary)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--ultra-text-secondary)' }}>Search for users to add as friends</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--ultra-bg)' }}>
              <User className="h-5 w-5" style={{ color: 'var(--ultra-text-muted)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--ultra-text-secondary)' }}>No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl p-4 flex items-center gap-3"
                style={{ boxShadow: 'var(--ultra-card-shadow)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ultra-primary-light)' }}>
                  <User className="h-4 w-4" style={{ color: 'var(--ultra-primary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--ultra-text)' }}>
                    {user.displayName}
                  </p>
                  <p className="text-[11px] truncate" style={{ color: 'var(--ultra-text-muted)' }}>{user.email}</p>
                </div>
                <button
                  onClick={() => handleSendRequest(user._id)}
                  disabled={isSendingRequest}
                  className="flex items-center gap-1 px-3 py-1.5 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
                  style={{ background: 'var(--ultra-primary)' }}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
