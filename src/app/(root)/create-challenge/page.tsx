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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 h-14 px-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Create Challenge</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6 pb-20">
        {/* Select Game */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Select Game</h2>
          {gamesLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    selectedGame?.gameName === game.gameName
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Trophy className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 ${
                    selectedGame?.gameName === game.gameName ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 text-center">{game.displayName}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">{game.platforms[0]}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Challenge Type */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Challenge Type</h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setChallengeType('DIRECT')}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all ${
                challengeType === 'DIRECT' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className={`h-4 w-4 sm:h-5 sm:w-5 ${challengeType === 'DIRECT' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-xs sm:text-sm font-semibold ${challengeType === 'DIRECT' ? 'text-blue-600' : 'text-gray-600'}`}>
                Direct
              </span>
            </button>

            <button
              onClick={() => setChallengeType('FRIENDS')}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all ${
                challengeType === 'FRIENDS' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className={`h-4 w-4 sm:h-5 sm:w-5 ${challengeType === 'FRIENDS' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-xs sm:text-sm font-semibold ${challengeType === 'FRIENDS' ? 'text-blue-600' : 'text-gray-600'}`}>
                Friends
              </span>
            </button>

            <button
              onClick={() => setChallengeType('PUBLIC')}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all ${
                challengeType === 'PUBLIC' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Globe className={`h-4 w-4 sm:h-5 sm:w-5 ${challengeType === 'PUBLIC' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-xs sm:text-sm font-semibold ${challengeType === 'PUBLIC' ? 'text-blue-600' : 'text-gray-600'}`}>
                Public
              </span>
            </button>
          </div>
        </div>

        {/* Stake Amount */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Stake Amount (₦)</h2>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {stake > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Pot:</span>
                <span className="font-semibold text-gray-900">₦{totalPot.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Winner Gets:</span>
                <span className="font-bold text-green-600">₦{winnerPayout.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Acceptance Deadline */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Acceptance Deadline</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-3">When should the challenge be accepted by?</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 pointer-events-none" />
              <input
                type="datetime-local"
                value={acceptanceDueDate}
                onChange={(e) => setAcceptanceDueDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Match Start Time */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Match Start Time</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-3">When will the match begin?</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 pointer-events-none" />
              <input
                type="datetime-local"
                value={matchStartTime}
                onChange={(e) => setMatchStartTime(e.target.value)}
                min={acceptanceDueDate}
                className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Game Options */}
        {selectedGame?.gameType === 'FOOTBALL' && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Game Options</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeExtraTime}
                  onChange={(e) => setIncludeExtraTime(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm sm:text-base text-gray-900">Include Extra Time</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePenalty}
                  onChange={(e) => setIncludePenalty(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm sm:text-base text-gray-900">Include Penalty Shootout</span>
              </label>
            </div>
          </div>
        )}

        {/* Witnessing Info */}
        <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-5 w-5 text-blue-600" />
            <h3 className="text-base sm:text-lg font-bold text-blue-900">About Witnessing</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 mb-3">
            After your challenge is accepted, it will be visible to other users who can volunteer to witness your match.
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">Witnesses verify match results</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">Witness earns 2% of the total pot</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">Ensures fair play and transparency</p>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreateChallenge}
          disabled={createChallengeMutation.isPending}
          className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createChallengeMutation.isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Trophy className="h-5 w-5" />
              <span>Create Challenge</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
