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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 h-14 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {query.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Search for users to add as friends</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => handleSendRequest(user._id)}
                  disabled={isSendingRequest}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
