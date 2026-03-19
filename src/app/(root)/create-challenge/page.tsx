'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trophy, Calendar, Clock, Users, Globe, User, Eye, Youtube, Twitch } from 'lucide-react';
import { challengeService } from '@/services/challenge.service';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  GameType,
  GameName,
  Platform,
  ChallengeType,
  CreateChallengeRequest,
  StreamingPlatform,
} from '@/types/challenge';

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
    };

    createChallengeMutation.mutate(challengeData);
  };

  const games = gamesData?.data?.games || [];
  const stake = parseFloat(stakeAmount) || 0;
  const totalPot = stake * 2;
  const winnerPayout = totalPot * 0.93;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
        <div className="flex items-center gap-3 h-12 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--ultra-text)' }} />
          </button>
          <h1 className="text-base font-bold" style={{ color: 'var(--ultra-text)' }}>Create Challenge</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4 pb-20">
        {/* Select Game */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
          <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--ultra-text)' }}>Select Game</h2>
          {gamesLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {games.map((game) => (
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
                  className="p-3 rounded-xl transition-all"
                  style={{
                    border: selectedGame?.gameName === game.gameName ? '2px solid var(--ultra-primary)' : '2px solid var(--ultra-border)',
                    background: selectedGame?.gameName === game.gameName ? 'var(--ultra-primary-light)' : 'white',
                  }}
                >
                  <Trophy className="h-5 w-5 mx-auto mb-1.5" style={{ color: selectedGame?.gameName === game.gameName ? 'var(--ultra-primary)' : 'var(--ultra-text-muted)' }} />
                  <p className="text-xs font-semibold text-center" style={{ color: 'var(--ultra-text)' }}>{game.displayName}</p>
                  <p className="text-[10px] text-center mt-0.5" style={{ color: 'var(--ultra-text-muted)' }}>{game.platforms[0]}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Challenge Type */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
          <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--ultra-text)' }}>Challenge Type</h2>
          <div className="grid grid-cols-3 gap-2">
            {([
              { type: 'DIRECT' as ChallengeType, icon: User, label: 'Direct' },
              { type: 'FRIENDS' as ChallengeType, icon: Users, label: 'Friends' },
              { type: 'PUBLIC' as ChallengeType, icon: Globe, label: 'Public' },
            ]).map(({ type, icon: TypeIcon, label }) => (
              <button
                key={type}
                onClick={() => setChallengeType(type)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                style={{
                  border: challengeType === type ? '2px solid var(--ultra-primary)' : '2px solid var(--ultra-border)',
                  background: challengeType === type ? 'var(--ultra-primary-light)' : 'white',
                }}
              >
                <TypeIcon className="h-4 w-4" style={{ color: challengeType === type ? 'var(--ultra-primary)' : 'var(--ultra-text-muted)' }} />
                <span className="text-xs font-semibold" style={{ color: challengeType === type ? 'var(--ultra-primary)' : 'var(--ultra-text-secondary)' }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stake Amount */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
          <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--ultra-text)' }}>Stake Amount (₦)</h2>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2"
            style={{ border: '1px solid var(--ultra-border)' } as React.CSSProperties}
          />
          {stake > 0 && (
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span style={{ color: 'var(--ultra-text-secondary)' }}>Total Pot:</span>
                <span className="font-semibold" style={{ color: 'var(--ultra-text)' }}>₦{totalPot.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span style={{ color: 'var(--ultra-text-secondary)' }}>Winner Gets:</span>
                <span className="font-bold" style={{ color: '#059669' }}>₦{winnerPayout.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Acceptance Deadline */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
          <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--ultra-text)' }}>Acceptance Deadline</h2>
          <p className="text-[11px] mb-3" style={{ color: 'var(--ultra-text-muted)' }}>When should the challenge be accepted by?</p>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--ultra-primary)' }} />
            <input
              type="datetime-local"
              value={acceptanceDueDate}
              onChange={(e) => setAcceptanceDueDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2"
              style={{ border: '1px solid var(--ultra-border)' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Match Start Time */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
          <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--ultra-text)' }}>Match Start Time</h2>
          <p className="text-[11px] mb-3" style={{ color: 'var(--ultra-text-muted)' }}>When will the match begin?</p>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--ultra-primary)' }} />
            <input
              type="datetime-local"
              value={matchStartTime}
              onChange={(e) => setMatchStartTime(e.target.value)}
              min={acceptanceDueDate}
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2"
              style={{ border: '1px solid var(--ultra-border)' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Game Options */}
        {selectedGame?.gameType === 'FOOTBALL' && (
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--ultra-text)' }}>Game Options</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeExtraTime}
                  onChange={(e) => setIncludeExtraTime(e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{ accentColor: 'var(--ultra-primary)' } as React.CSSProperties}
                />
                <span className="text-sm" style={{ color: 'var(--ultra-text)' }}>Include Extra Time</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePenalty}
                  onChange={(e) => setIncludePenalty(e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{ accentColor: 'var(--ultra-primary)' } as React.CSSProperties}
                />
                <span className="text-sm" style={{ color: 'var(--ultra-text)' }}>Include Penalty Shootout</span>
              </label>
            </div>
          </div>
        )}

        {/* Witnessing Info */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--ultra-primary-light)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4" style={{ color: 'var(--ultra-primary)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--ultra-primary)' }}>About Witnessing</h3>
          </div>
          <p className="text-xs mb-2" style={{ color: 'var(--ultra-text-secondary)' }}>
            After acceptance, other users can volunteer to witness your match.
          </p>
          <div className="space-y-1">
            {['Witnesses verify match results', 'Witness earns 2% of total pot', 'Ensures fair play and transparency'].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#059669' }}>
                  <span className="text-white text-[8px]">✓</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--ultra-text-secondary)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreateChallenge}
          disabled={createChallengeMutation.isPending}
          className="w-full flex items-center justify-center gap-2 py-3 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
          style={{ background: 'var(--ultra-primary)' }}
        >
          {createChallengeMutation.isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Trophy className="h-4 w-4" />
              <span>Create Challenge</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
