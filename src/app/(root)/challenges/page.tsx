'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Filter } from 'lucide-react';
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

  const majorTabs: { key: MajorTabType; label: string; description: string }[] = [
    { key: 'challenges', label: 'Challenges', description: 'Create, accept, and manage your wagers' },
    { key: 'witnessing', label: 'Witnessing', description: 'Earn by keeping matches honest' },
  ];

  return (
    <div className="min-h-screen bg-[#03060b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Hero */}
        <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#131A31] via-[#0B0F1B] to-[#05070C] p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[#00FFB2]">FAZN Arena</p>
            <h1 className="text-3xl font-bold">Challenges</h1>
            <p className="text-sm text-white/70 max-w-xl">
              Jump into public standoffs, defend your invitations, or witness the hottest wagers on the platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/create-challenge" className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold" style={{ background: '#00FFB2', color: '#05070b' }}>
                Drop a Challenge
                <Plus className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold border border-white/10 text-white/90">
                <Filter className="h-4 w-4" />
                Smart Filters
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            {majorTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMajorTab(tab.key)}
                className="rounded-2xl border border-white/5 p-4 text-left transition-all"
                style={{ background: majorTab === tab.key ? 'rgba(0,255,178,0.08)' : 'rgba(255,255,255,0.03)' }}
              >
                <p className="text-sm font-semibold">{tab.label}</p>
                <p className="text-[11px] text-white/60 mt-1">{tab.description}</p>
                {majorTab === tab.key && <div className="mt-3 h-1 rounded-full" style={{ background: '#00FFB2' }} />}
              </button>
            ))}
          </div>
        </section>

        {/* Sub tabs */}
        <div className="rounded-3xl border border-white/5 bg-[#080C14] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{majorTab === 'challenges' ? 'Challenge Categories' : 'Witnessing Pools'}</p>
              <p className="text-base font-semibold">{majorTab === 'challenges' ? 'Pick your battleground' : 'Select witnessing mode'}</p>
            </div>
            <p className="text-xs text-white/60">{challenges.length} showing</p>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {(majorTab === 'challenges' ? challengeTabs : witnessingTabs).map((tab) => {
              const isActive = majorTab === 'challenges' ? challengeTab === tab.key : witnessingTab === tab.key;
              const onClick = () =>
                majorTab === 'challenges'
                  ? handleChallengeTabChange(tab.key as ChallengeTabType)
                  : handleWitnessingTabChange(tab.key as WitnessingTabType);
              return (
                <button
                  key={tab.key}
                  onClick={onClick}
                  className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
                  style={{
                    background: isActive ? '#00FFB2' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#05070b' : 'white',
                    border: isActive ? '1px solid #00FFB2' : '1px solid transparent',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <section className="rounded-3xl border border-white/5 bg-[#080C14] p-5 min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10" style={{ borderTopColor: '#00FFB2' }} />
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="mx-auto h-14 w-14 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(0,255,178,0.08)', color: '#00FFB2' }}>
                <Plus className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold">{getEmptyMessage()}</p>
              <p className="text-xs text-white/60">Try switching tabs or create your own challenge.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <ChallengeCard key={challenge._id} challenge={challenge} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
