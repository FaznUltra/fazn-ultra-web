'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { useChallengeHistory } from '@/hooks/useChallenges';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';

const filters = [
  { value: 'all',                label: 'All'         },
  { value: 'PENDING_ACCEPTANCE', label: 'Pending'     },
  { value: 'ACCEPTED',           label: 'In Progress' },
  { value: 'COMPLETED',          label: 'Completed'   },
  { value: 'CANCELLED',          label: 'Cancelled'   },
];

export default function ChallengeHistoryPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const { data, isLoading } = useChallengeHistory({
    status: filter === 'all' ? undefined : filter,
    limit: 50,
  });

  const challenges = data?.data?.challenges || [];

  return (
    <div className="min-h-screen bg-[#03060b] text-white pb-24 lg:pb-6">

      {/* ── Header ── */}
      <div className="border-b border-white/[0.05] lg:hidden">
        <div className="flex items-center gap-3 h-14 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/[0.06] transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5 text-white/60" />
          </button>
          <h1 className="text-base font-bold text-white/90">Challenge History</h1>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filters.map((f) => {
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all"
                style={{
                  background: isActive ? '#00FFB2' : 'rgba(255,255,255,0.05)',
                  color:      isActive ? '#05070b' : 'rgba(255,255,255,0.4)',
                  border:     isActive ? '1px solid #00FFB2' : '1px solid transparent',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div
              className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10"
              style={{ borderTopColor: '#00FFB2' }}
            />
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <div
              className="mx-auto h-14 w-14 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(0,255,178,0.07)' }}
            >
              <Gamepad2 className="h-5 w-5 text-[#00FFB2]" />
            </div>
            <p className="text-sm font-bold text-white/40">No Challenges Yet</p>
            <p className="text-xs text-white/20">Your challenge history will appear here</p>
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