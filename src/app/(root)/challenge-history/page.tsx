'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Gamepad2, Trophy, User } from 'lucide-react';
import { useChallengeHistory } from '@/hooks/useChallenges';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';

export default function ChallengeHistoryPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');

  const { data, isLoading } = useChallengeHistory({
    status: filter === 'all' ? undefined : filter,
    limit: 50,
  });

  const challenges = data?.data?.challenges || [];

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'PENDING_ACCEPTANCE', label: 'Pending' },
    { value: 'ACCEPTED', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Challenge History</h1>
          <div className="w-9" />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-12">
            <Gamepad2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 mb-2">No Challenges Yet</p>
            <p className="text-gray-500">Your challenge history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge._id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
