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
    <div className="min-h-screen bg-[#03060b] text-white pb-24 lg:pb-6">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 border-b border-white/[0.05] bg-[#03060b]/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 h-14 px-4 lg:px-0">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-white/[0.06] flex-shrink-0 lg:hidden"
          >
            <ArrowLeft className="h-5 w-5 text-white/60" />
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search players..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/30 focus:border-[#00FFB2]/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-4">
        {/* Empty — no query yet */}
        {query.length === 0 && (
          <div className="text-center py-24 space-y-3">
            <div
              className="mx-auto h-14 w-14 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(0,255,178,0.07)' }}
            >
              <Search className="h-5 w-5" style={{ color: '#00FFB2' }} />
            </div>
            <p className="text-sm font-semibold text-white/30">Search for players to add</p>
            <p className="text-xs text-white/20">Type a username or display name</p>
          </div>
        )}

        {/* Loading */}
        {query.length > 0 && isLoading && (
          <div className="flex justify-center py-20">
            <div
              className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10"
              style={{ borderTopColor: '#00FFB2' }}
            />
          </div>
        )}

        {/* No results */}
        {query.length > 0 && !isLoading && users.length === 0 && (
          <div className="text-center py-24 space-y-3">
            <div
              className="mx-auto h-14 w-14 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <User className="h-5 w-5 text-white/20" />
            </div>
            <p className="text-sm font-semibold text-white/30">No players found</p>
            <p className="text-xs text-white/20">Try a different name</p>
          </div>
        )}

        {/* Results */}
        {query.length > 0 && !isLoading && users.length > 0 && (
          <>
            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-3 px-1">
              {users.length} result{users.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2.5">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4 flex items-center gap-3"
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(124,140,255,0.15)' }}
                  >
                    <User className="h-4 w-4" style={{ color: '#7C8CFF' }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-white">{user.displayName}</p>
                    <p className="text-[11px] truncate text-white/35">{user.email}</p>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleSendRequest(user._id)}
                    disabled={isSendingRequest}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40 flex-shrink-0"
                    style={{ background: '#00FFB2', color: '#05070b' }}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}