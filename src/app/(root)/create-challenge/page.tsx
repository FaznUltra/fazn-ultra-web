'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Trophy, Calendar, Clock, Users, Globe, User, Eye, Zap, Sparkles, Shield } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { challengeService } from '@/services/challenge.service';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { FriendsSelectionModal } from '@/components/challenge/FriendsSelectionModal';
import {
  GameType,
  GameName,
  Platform,
  ChallengeType,
  CreateChallengeRequest,
  StreamingPlatform,
} from '@/types/challenge';

// Game image mapping
const getGameImage = (gameName: GameName): string => {
  const imageMap: Record<string, string> = {
    'DREAM_LEAGUE_SOCCER': '/images/dream-league-soccer.jpg',
    'EFOOTBALL_MOBILE': '/images/e-football.jpg',
  };
  return imageMap[gameName] || '/images/default-game.jpg';
};

export default function CreateChallengePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [selectedGame, setSelectedGame] = useState<{
    gameType: GameType;
    gameName: GameName;
    platform: Platform;
    displayName: string;
  } | null>(null);
  const [challengeType, setChallengeType] = useState<ChallengeType>('PUBLIC');
  const [stakeAmount, setStakeAmount] = useState('');
  const [acceptanceDueDate, setAcceptanceDueDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [matchStartTime, setMatchStartTime] = useState<string>(
    new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [includeExtraTime, setIncludeExtraTime] = useState(false);
  const [includePenalty, setIncludePenalty] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<{ id: string; name: string } | null>(null);

  const { data: gamesData, isLoading: gamesLoading } = useQuery({
    queryKey: ['available-games'],
    queryFn: () => challengeService.getAvailableGames(),
  });

  const createChallengeMutation = useMutation({
    mutationFn: (data: CreateChallengeRequest) => challengeService.createChallenge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge created successfully!');
      router.push('/challenges');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create challenge');
    },
  });

  const handleCreateChallenge = () => {
    if (!selectedGame) {
      toast.error('Please select a game');
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid stake amount');
      return;
    }

    const acceptanceDate = new Date(acceptanceDueDate);
    const matchDate = new Date(matchStartTime);

    if (acceptanceDate <= new Date()) {
      toast.error('Acceptance deadline must be in the future');
      return;
    }

    if (matchDate <= acceptanceDate) {
      toast.error('Match start time must be after acceptance deadline');
      return;
    }

    // Validate direct challenge has a selected friend
    if (challengeType === 'DIRECT' && !selectedFriend) {
      toast.error('Please select a friend to challenge');
      return;
    }

    const challengeData: CreateChallengeRequest = {
      gameType: selectedGame.gameType,
      gameName: selectedGame.gameName,
      platform: selectedGame.platform,
      challengeType,
      stakeAmount: parseFloat(stakeAmount),
      currency: 'NGN',
      acceptanceDueDate: acceptanceDate.toISOString(),
      matchStartTime: matchDate.toISOString(),
      includeExtraTime,
      includePenalty,
      ...(challengeType === 'DIRECT' && selectedFriend ? { directOpponentId: selectedFriend.id } : {}),
    };

    createChallengeMutation.mutate(challengeData);
  };

  const games = gamesData?.data?.games || [];
  const stake = parseFloat(stakeAmount) || 0;
  const totalPot = stake * 2;
  const winnerPayout = totalPot * 0.93;
  const platformFee = totalPot * 0.05;
  const witnessFee = totalPot * 0.02;

  // Shared styling tokens
  const panel = 'rounded-3xl border border-white/5 bg-white/[0.04] backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]';
  const inputClass = 'w-full px-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 focus:border-[#00FFB2]/50 transition-all';
  const btnPrimary = 'px-5 py-3 rounded-full font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen bg-[#03060b] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5 lg:hidden" style={{ background: 'rgba(3,6,11,0.8)' }}>
        <div className="flex items-center gap-3 h-14 px-4 max-w-3xl mx-auto">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
          <h1 className="text-base font-bold">Create Challenge</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 lg:px-0 py-6 pb-24 lg:pb-6 space-y-5">
        {/* Hero Section */}
        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#131A31] via-[#0B0F1B] to-[#05070C] p-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FFB2]/5 via-transparent to-[#7C8CFF]/5 pointer-events-none" />
          <div className="relative space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#00FFB2]" />
              <p className="text-xs uppercase tracking-[0.4em] text-[#00FFB2]">Drop a Challenge</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Create Your Wager</h1>
            <p className="text-sm text-white/60 max-w-xl leading-relaxed">
              Set your stakes, pick your game, and challenge the arena. Winners take glory—and the pot.
            </p>
          </div>
        </div>

        {/* Select Game */}
        <div className={panel}>
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 text-[#FBCB4A]" />
              <h2 className="text-sm font-bold">Select Game</h2>
            </div>
            {gamesLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/10 border-t-[#00FFB2]" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {games.map((game) => {
                  const isSelected = selectedGame?.gameName === game.gameName;
                  return (
                    <button
                      key={game.gameName}
                      onClick={() =>
                        setSelectedGame({
                          gameType: game.gameType,
                          gameName: game.gameName,
                          platform: game.platforms[0],
                          displayName: game.displayName,
                        })
                      }
                      className="rounded-2xl transition-all border relative overflow-hidden group"
                      style={{
                        borderColor: isSelected ? '#00FFB2' : 'rgba(255,255,255,0.1)',
                        background: isSelected ? 'rgba(0,255,178,0.08)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#00FFB2] flex items-center justify-center z-10">
                          <span className="text-[#05070b] text-xs font-bold">✓</span>
                        </div>
                      )}
                      <div className="relative w-full aspect-[16/9]">
                        <Image
                          src={getGameImage(game.gameName)}
                          alt={game.displayName}
                          fill
                          className="object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#00FFB2]/10" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-bold text-center">{game.displayName}</p>
                        <p className="text-[10px] text-center mt-1 text-white/40">{game.platforms[0]}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Challenge Type */}
        <div className={panel}>
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-[#7C8CFF]" />
              <h2 className="text-sm font-bold">Challenge Type</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {([
                { type: 'DIRECT' as ChallengeType, icon: User, label: 'Direct', desc: '1v1' },
                { type: 'FRIENDS' as ChallengeType, icon: Users, label: 'Friends', desc: 'Circle' },
                { type: 'PUBLIC' as ChallengeType, icon: Globe, label: 'Public', desc: 'Open' },
              ]).map(({ type, icon: TypeIcon, label, desc }) => {
                const isSelected = challengeType === type;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      if (type === 'DIRECT') {
                        setChallengeType(type);
                        setShowFriendsModal(true);
                      } else {
                        setChallengeType(type);
                        setSelectedFriend(null);
                      }
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border"
                    style={{
                      borderColor: isSelected ? '#7C8CFF' : 'rgba(255,255,255,0.1)',
                      background: isSelected ? 'rgba(124,140,255,0.08)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <TypeIcon className="h-5 w-5" style={{ color: isSelected ? '#7C8CFF' : 'rgba(255,255,255,0.4)' }} />
                    <div className="text-center">
                      <p className="text-xs font-semibold" style={{ color: isSelected ? '#7C8CFF' : 'white' }}>{label}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stake Amount */}
        <div className={panel}>
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-[#FBCB4A]" />
              <h2 className="text-sm font-bold">Stake Amount</h2>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-semibold">₦</span>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Enter your stake"
                className={`${inputClass} pl-9 text-base font-semibold`}
              />
            </div>
            {stake > 0 && (
              <div className="mt-4 p-4 rounded-2xl border border-white/5" style={{ background: 'rgba(0,255,178,0.03)' }}>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50">Your Stake</span>
                    <span className="text-sm font-semibold">₦{stake.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50">Opponent Stake</span>
                    <span className="text-sm font-semibold">₦{stake.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50">Total Pot</span>
                    <span className="text-sm font-bold text-[#FBCB4A]">₦{totalPot.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50">Platform Fee (5%)</span>
                    <span className="text-xs text-white/40">-₦{platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50">Witness Fee (2%)</span>
                    <span className="text-xs text-white/40">-₦{witnessFee.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#00FFB2]">Winner Takes</span>
                    <span className="text-lg font-bold text-[#00FFB2]">₦{winnerPayout.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Acceptance Deadline */}
        <div className={panel}>
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-[#FF61D6]" />
              <h2 className="text-sm font-bold">Acceptance Deadline</h2>
            </div>
            <p className="text-xs text-white/40 mb-4">When should the challenge be accepted by?</p>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-white/30" />
              <input
                type="datetime-local"
                value={acceptanceDueDate}
                onChange={(e) => setAcceptanceDueDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className={`${inputClass} pl-11 text-[16px]`}
                style={{ maxWidth: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Match Start Time */}
        <div className={panel}>
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-[#FF9F43]" />
              <h2 className="text-sm font-bold">Match Start Time</h2>
            </div>
            <p className="text-xs text-white/40 mb-4">When will the match begin?</p>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-white/30" />
              <input
                type="datetime-local"
                value={matchStartTime}
                onChange={(e) => setMatchStartTime(e.target.value)}
                min={acceptanceDueDate}
                className={`${inputClass} pl-11 text-[16px]`}
                style={{ maxWidth: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Game Options */}
        {selectedGame?.gameType === 'FOOTBALL' && (
          <div className={panel}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-[#7C8CFF]" />
                <h2 className="text-sm font-bold">Game Rules</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={includeExtraTime}
                      onChange={(e) => setIncludeExtraTime(e.target.checked)}
                      className="peer w-5 h-5 rounded border-2 border-white/20 bg-white/5 checked:bg-[#00FFB2] checked:border-[#00FFB2] cursor-pointer appearance-none transition-all"
                    />
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-[#05070b] pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm group-hover:text-[#00FFB2] transition-colors">Include Extra Time</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={includePenalty}
                      onChange={(e) => setIncludePenalty(e.target.checked)}
                      className="peer w-5 h-5 rounded border-2 border-white/20 bg-white/5 checked:bg-[#00FFB2] checked:border-[#00FFB2] cursor-pointer appearance-none transition-all"
                    />
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-[#05070b] pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm group-hover:text-[#00FFB2] transition-colors">Include Penalty Shootout</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Witnessing Info */}
        <div className="rounded-3xl border border-[#00FFB2]/20 p-5 relative overflow-hidden" style={{ background: 'rgba(0,255,178,0.05)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFB2]/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-[#00FFB2]" />
              <h3 className="text-sm font-bold text-[#00FFB2]">About Witnessing</h3>
            </div>
            <p className="text-xs text-white/60 mb-3 leading-relaxed">
              After acceptance, other users can volunteer to witness your match and ensure fair play.
            </p>
            <div className="space-y-2">
              {[
                { text: 'Witnesses verify match results', icon: '✓' },
                { text: 'Witness earns 2% of total pot', icon: '₦' },
                { text: 'Ensures fair play and transparency', icon: '⚡' }
              ].map(({ text, icon }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-[#00FFB2]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#00FFB2] text-xs font-bold">{icon}</span>
                  </div>
                  <p className="text-xs text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Friend Indicator */}
        {challengeType === 'DIRECT' && selectedFriend && (
          <div className="rounded-2xl border border-[#7C8CFF]/20 p-4 flex items-center justify-between" style={{ background: 'rgba(124,140,255,0.05)' }}>
            <div>
              <p className="text-xs text-white/50 mb-1">Challenging</p>
              <p className="text-sm font-bold text-[#7C8CFF]">{selectedFriend.name}</p>
            </div>
            <button
              onClick={() => setShowFriendsModal(true)}
              className="text-xs text-[#7C8CFF] hover:text-[#00FFB2] transition-colors font-semibold"
            >
              Change →
            </button>
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={handleCreateChallenge}
          disabled={createChallengeMutation.isPending || !selectedGame || !stakeAmount}
          className={`w-full flex items-center justify-center gap-2 ${btnPrimary} text-[#05070b] font-bold`}
          style={{ background: '#00FFB2' }}
        >
          {createChallengeMutation.isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#05070b]/20 border-t-[#05070b]"></div>
              <span>Creating Challenge...</span>
            </>
          ) : (
            <>
              <Trophy className="h-5 w-5" />
              <span>Drop Challenge</span>
            </>
          )}
        </button>
      </div>

      {/* Friends Selection Modal */}
      <FriendsSelectionModal
        isOpen={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        onSelectFriend={(friendId, friendName) => {
          setSelectedFriend({ id: friendId, name: friendName });
        }}
      />
    </div>
  );
}
