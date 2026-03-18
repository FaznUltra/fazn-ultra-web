'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { 
  usePublicChallenges, 
  useInvitedChallenges, 
  useUpcomingChallenges, 
  useLiveChallenges, 
  useFlaggedChallenges, 
  useDisputedChallenges, 
  useHistoryChallenges,
  useWitnessingChallenges,
  useMyWitnessingChallenges 
} from '@/hooks/useChallenges';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';

type MajorTabType = 'challenges' | 'witnessing';
type ChallengeTabType = 'public' | 'invited' | 'upcoming' | 'live' | 'flagged' | 'disputed' | 'history';
type WitnessingTabType = 'available' | 'my-witnessing';

export default function ChallengesPage() {
  const router = useRouter();
  const [majorTab, setMajorTab] = useState<MajorTabType>('challenges');
  const [challengeTab, setChallengeTab] = useState<ChallengeTabType>('public');
  const [witnessingTab, setWitnessingTab] = useState<WitnessingTabType>('available');

  // Challenge queries
  const { data: publicData, isLoading: publicLoading, refetch: refetchPublic } = usePublicChallenges({ limit: 20, page: 1 });
  const { data: invitedData, isLoading: invitedLoading, refetch: refetchInvited } = useInvitedChallenges({ limit: 20, page: 1 });
  const { data: upcomingData, isLoading: upcomingLoading, refetch: refetchUpcoming } = useUpcomingChallenges({ limit: 20, page: 1 });
  const { data: liveData, isLoading: liveLoading, refetch: refetchLive } = useLiveChallenges({ limit: 20, page: 1 });
  const { data: flaggedData, isLoading: flaggedLoading, refetch: refetchFlagged } = useFlaggedChallenges({ limit: 20, page: 1 });
  const { data: disputedData, isLoading: disputedLoading, refetch: refetchDisputed } = useDisputedChallenges({ limit: 20, page: 1 });
  const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useHistoryChallenges({ limit: 20, page: 1 });
  
  // Witnessing queries
  const { data: witnessingData, isLoading: witnessingLoading, refetch: refetchWitnessing } = useWitnessingChallenges({ limit: 20, page: 1 });
  const { data: myWitnessingData, isLoading: myWitnessingLoading, refetch: refetchMyWitnessing } = useMyWitnessingChallenges({ limit: 20, page: 1 });

  const getChallenges = () => {
    if (majorTab === 'challenges') {
      switch (challengeTab) {
        case 'public': return publicData?.data?.challenges || [];
        case 'invited': return invitedData?.data?.challenges || [];
        case 'upcoming': return upcomingData?.data?.challenges || [];
        case 'live': return liveData?.data?.challenges || [];
        case 'flagged': return flaggedData?.data?.challenges || [];
        case 'disputed': return disputedData?.data?.challenges || [];
        case 'history': return historyData?.data?.challenges || [];
        default: return [];
      }
    } else {
      switch (witnessingTab) {
        case 'available': return witnessingData?.data?.challenges || [];
        case 'my-witnessing': return myWitnessingData?.data?.challenges || [];
        default: return [];
      }
    }
  };

  const getLoading = () => {
    if (majorTab === 'challenges') {
      switch (challengeTab) {
        case 'public': return publicLoading;
        case 'invited': return invitedLoading;
        case 'upcoming': return upcomingLoading;
        case 'live': return liveLoading;
        case 'flagged': return flaggedLoading;
        case 'disputed': return disputedLoading;
        case 'history': return historyLoading;
        default: return false;
      }
    } else {
      switch (witnessingTab) {
        case 'available': return witnessingLoading;
        case 'my-witnessing': return myWitnessingLoading;
        default: return false;
      }
    }
  };

  const challenges = getChallenges();
  const isLoading = getLoading();

  const getEmptyMessage = () => {
    if (majorTab === 'challenges') {
      switch (challengeTab) {
        case 'public': return 'No public challenges available';
        case 'invited': return 'No pending invitations';
        case 'upcoming': return 'No upcoming challenges';
        case 'live': return 'No live challenges';
        case 'flagged': return 'No flagged challenges';
        case 'disputed': return 'No disputed challenges';
        case 'history': return 'No challenge history';
        default: return 'No challenges found';
      }
    } else {
      switch (witnessingTab) {
        case 'available': return 'No challenges available for witnessing';
        case 'my-witnessing': return 'You are not witnessing any challenges';
        default: return 'No challenges found';
      }
    }
  };

  const handleChallengeTabChange = (tab: ChallengeTabType) => {
    setChallengeTab(tab);
    switch (tab) {
      case 'public': refetchPublic(); break;
      case 'invited': refetchInvited(); break;
      case 'upcoming': refetchUpcoming(); break;
      case 'live': refetchLive(); break;
      case 'flagged': refetchFlagged(); break;
      case 'disputed': refetchDisputed(); break;
      case 'history': refetchHistory(); break;
    }
  };

  const handleWitnessingTabChange = (tab: WitnessingTabType) => {
    setWitnessingTab(tab);
    switch (tab) {
      case 'available': refetchWitnessing(); break;
      case 'my-witnessing': refetchMyWitnessing(); break;
    }
  };

  const challengeTabs: { key: ChallengeTabType; label: string }[] = [
    { key: 'public', label: 'Public' },
    { key: 'invited', label: 'Invited' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'live', label: 'Live' },
    { key: 'flagged', label: 'Flagged' },
    { key: 'disputed', label: 'Disputed' },
    { key: 'history', label: 'History' },
  ];

  const witnessingTabs: { key: WitnessingTabType; label: string }[] = [
    { key: 'available', label: 'Available' },
    { key: 'my-witnessing', label: 'My Witnessing' },
  ];

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
            {challengeTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleChallengeTabChange(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  challengeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {majorTab === 'witnessing' && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {witnessingTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleWitnessingTabChange(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  witnessingTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
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
            <p className="text-gray-500 text-sm">{getEmptyMessage()}</p>
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
