'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { usePublicChallenges, useFriendsChallenges, useChallengeHistory, useWitnessingChallenges, useMyWitnessingChallenges } from '@/hooks/useChallenges';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';

type MajorTabType = 'challenges' | 'witnessing';
type ChallengeSubTabType = 'public' | 'friends' | 'history';
type WitnessingSubTabType = 'available' | 'my-witnessing';

export default function ChallengesPage() {
  const router = useRouter();
  const [majorTab, setMajorTab] = useState<MajorTabType>('challenges');
  const [challengeSubTab, setChallengeSubTab] = useState<ChallengeSubTabType>('public');
  const [witnessingSubTab, setWitnessingSubTab] = useState<WitnessingSubTabType>('available');

  const { data: publicData, isLoading: publicLoading } = usePublicChallenges({ limit: 20, page: 1 });
  const { data: friendsData, isLoading: friendsLoading } = useFriendsChallenges({ limit: 20, page: 1 });
  const { data: historyData, isLoading: historyLoading } = useChallengeHistory({ limit: 20, page: 1 });
  const { data: witnessingData, isLoading: witnessingLoading } = useWitnessingChallenges({ limit: 20, page: 1 });
  const { data: myWitnessingData, isLoading: myWitnessingLoading } = useMyWitnessingChallenges({ limit: 20, page: 1 });

  const challenges = majorTab === 'challenges'
    ? challengeSubTab === 'public'
      ? publicData?.data?.challenges || []
      : challengeSubTab === 'friends'
      ? friendsData?.data?.challenges || []
      : historyData?.data?.challenges || []
    : witnessingSubTab === 'available'
      ? witnessingData?.data?.challenges || []
      : myWitnessingData?.data?.challenges || [];

  const isLoading = majorTab === 'challenges'
    ? challengeSubTab === 'public'
      ? publicLoading
      : challengeSubTab === 'friends'
      ? friendsLoading
      : historyLoading
    : witnessingSubTab === 'available'
      ? witnessingLoading
      : myWitnessingLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-bold text-gray-900">Challenges</h1>
          <button
            onClick={() => router.push('/create-challenge')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Major Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setMajorTab('challenges')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              majorTab === 'challenges'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Challenges
          </button>
          <button
            onClick={() => setMajorTab('witnessing')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              majorTab === 'witnessing'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Witnessing
          </button>
        </div>

        {/* Sub Tabs */}
        {majorTab === 'challenges' && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {['public', 'friends', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setChallengeSubTab(tab as ChallengeSubTabType)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  challengeSubTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}

        {majorTab === 'witnessing' && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            <button
              onClick={() => setWitnessingSubTab('available')}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                witnessingSubTab === 'available'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setWitnessingSubTab('my-witnessing')}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                witnessingSubTab === 'my-witnessing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              My Witnessing
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">
              {majorTab === 'challenges'
                ? challengeSubTab === 'public'
                  ? 'No public challenges available'
                  : challengeSubTab === 'friends'
                  ? 'No challenges from friends'
                  : 'No challenge history'
                : witnessingSubTab === 'available'
                ? 'No challenges available for witnessing'
                : 'You are not witnessing any challenges'}
            </p>
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
