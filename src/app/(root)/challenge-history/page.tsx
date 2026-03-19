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
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
        <div className="flex items-center gap-3 h-12 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--ultra-text)' }} />
          </button>
          <h1 className="text-base font-bold" style={{ color: 'var(--ultra-text)' }}>Challenge History</h1>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: filter === f.value ? 'var(--ultra-primary)' : 'var(--ultra-primary-light)',
                color: filter === f.value ? 'white' : 'var(--ultra-primary)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--ultra-primary-light)' }}>
              <Gamepad2 className="h-5 w-5" style={{ color: 'var(--ultra-primary)' }} />
            </div>
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--ultra-text)' }}>No Challenges Yet</p>
            <p className="text-xs" style={{ color: 'var(--ultra-text-muted)' }}>Your challenge history will appear here</p>
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
