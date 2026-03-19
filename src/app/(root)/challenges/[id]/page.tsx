'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Trophy, 
  Users, 
  Clock, 
  DollarSign,
  Radio,
  Eye,
  Flag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Youtube,
  Twitch,
  Key,
  PlayCircle,
  Clipboard,
  Calendar,
  User,
  RefreshCw
} from 'lucide-react';
import { challengeService } from '@/services/challenge.service';
import { StreamPlayer } from '@/components/challenges/StreamPlayer';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Challenge, StreamingPlatform } from '@/types/challenge';
import { userService } from '@/services/user.service';
import { StreamingStatus } from '@/components/StreamingStatus';
import { PrivateChatRoom } from '@/components/PrivateChatRoom';
import { CommunityChat } from '@/components/CommunityChat';
import { VODEvidence } from '@/components/VODEvidence';
import { PhoneVerification } from '@/components/PhoneVerification';
import { spectatingService } from '@/services/spectating.service';

interface ChallengeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ChallengeDetailPage({ params }: ChallengeDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showStartMatchModal, setShowStartMatchModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRoomCodeModal, setShowRoomCodeModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] = useState(false);
  const [isSpectating, setIsSpectating] = useState(false);
  
  const [streamingPlatform, setStreamingPlatform] = useState<StreamingPlatform | null>(null);
  const [streamingUrl, setStreamingUrl] = useState('');
  const [updateStreamingFor, setUpdateStreamingFor] = useState<'creator' | 'acceptor' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [creatorScore, setCreatorScore] = useState('');
  const [acceptorScore, setAcceptorScore] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeTimeRemaining, setDisputeTimeRemaining] = useState<string>('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['challenge', resolvedParams.id],
    queryFn: () => challengeService.getChallengeById(resolvedParams.id),
    enabled: !!resolvedParams.id,
  });

  const { data: userProfileData } = useQuery({
    queryKey: ['user-profile', user?._id],
    queryFn: () => {
      if (!user?._id) throw new Error('User ID not available');
      return userService.getProfile(user._id);
    },
    enabled: !!user?._id,
  });

  const { data: streamingStatusData, refetch: refetchStreamingStatus, isFetching: isRefreshingStreaming } = useQuery({
    queryKey: ['streaming-status', resolvedParams.id],
    queryFn: () => challengeService.getStreamingStatus(resolvedParams.id),
    enabled: !!resolvedParams.id && !!data?.data?.challenge,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time status
  });

  const challenge = data?.data?.challenge;
  const currentUserProfile = userProfileData?.data?.user;
  const streamingStatus = streamingStatusData?.data;

  // Dispute countdown timer
  useEffect(() => {
    if (!challenge?.disputeDeadline) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const deadline = new Date(challenge.disputeDeadline!).getTime();
      const timeLeft = deadline - now;

      if (timeLeft <= 0) {
        setDisputeTimeRemaining('Expired');
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      if (hours > 0) {
        setDisputeTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setDisputeTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setDisputeTimeRemaining(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [challenge?.disputeDeadline]);

  // Mutations
  const acceptMutation = useMutation({
    mutationFn: () => challengeService.acceptChallenge(resolvedParams.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge accepted! Your stake has been deducted.');
      setShowAcceptModal(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to accept challenge');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => challengeService.rejectChallenge(resolvedParams.id, { reason: rejectReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge rejected. Creator has been refunded.');
      setShowRejectModal(false);
      refetch();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to reject challenge'),
  });

  const cancelMutation = useMutation({
    mutationFn: () => challengeService.cancelChallenge(resolvedParams.id, { reason: cancelReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge cancelled. Your stake has been refunded.');
      router.back();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to cancel challenge'),
  });

  const updateStreamingMutation = useMutation({
    mutationFn: (data: { platform: StreamingPlatform; url: string }) =>
      challengeService.updateStreamingLink(resolvedParams.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      toast.success('Streaming link updated!');
      setStreamingPlatform(null);
      setStreamingUrl('');
      refetch();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update streaming link'),
  });

  const volunteerWitnessMutation = useMutation({
    mutationFn: () => challengeService.volunteerAsWitness(resolvedParams.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      toast.success('You are now witnessing this challenge!');
      refetch();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to volunteer as witness';
      toast.error(errorMessage);
      if (errorMessage.includes('phone number')) {
        setShowPhoneVerificationModal(true);
      }
    },
  });

  const joinAsSpectatorMutation = useMutation({
    mutationFn: () => spectatingService.joinAsSpectator(resolvedParams.id),
    onSuccess: () => {
      setIsSpectating(true);
      toast.success('Joined as spectator!');
      refetch();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to join as spectator'),
  });

  const shareRoomCodeMutation = useMutation({
    mutationFn: (code: string) => challengeService.shareRoomCode(resolvedParams.id, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      setShowRoomCodeModal(false);
      setRoomCode('');
      toast.success('Room code shared successfully!');
      refetch();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to share room code'),
  });

  const confirmJoinedMutation = useMutation({
    mutationFn: () => challengeService.confirmJoinedRoom(resolvedParams.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      toast.success('Confirmed you have joined the room!');
      refetch();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to confirm join'),
  });

  const startMatchMutation = useMutation({
    mutationFn: () => challengeService.startMatch(resolvedParams.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      toast.success('Match has been started!');
      setShowStartMatchModal(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start match');
      setShowStartMatchModal(false);
    },
  });

  const flagMatchMutation = useMutation({
    mutationFn: (reason: string) => challengeService.flagMatch(resolvedParams.id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      setShowFlagModal(false);
      setFlagReason('');
      toast.success('Match flagged successfully. Our team will review this case.');
      refetch();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to flag match'),
  });

  const completeMatchMutation = useMutation({
    mutationFn: (data: { creatorScore: number; acceptorScore: number }) =>
      challengeService.completeMatch(resolvedParams.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      setShowScoreModal(false);
      setCreatorScore('');
      setAcceptorScore('');
      toast.success('Match completed! Players have 10 minutes to dispute.');
      refetch();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to complete match'),
  });

  const disputeMatchMutation = useMutation({
    mutationFn: (reason: string) => challengeService.disputeMatch(resolvedParams.id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      setShowDisputeModal(false);
      setDisputeReason('');
      toast.success('Dispute submitted. Our team will review this case.');
      refetch();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to submit dispute'),
  });

  const settleMutation = useMutation({
    mutationFn: () => challengeService.settleChallenge(resolvedParams.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Challenge settled successfully! Funds have been disbursed.');
      refetch();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to settle challenge'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-16 w-16 text-red-600 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Challenge Not Found</h2>
        <p className="text-gray-600 mb-6">This challenge may have been deleted or doesn't exist.</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isCreator = challenge.creator._id === user?._id;
  const isAcceptor = challenge.acceptor?._id === user?._id;
  const isWitness = challenge.witness?._id === user?._id;
  const isParticipant = isCreator || isAcceptor;
  
  const canAccept = !isCreator && (challenge.status === 'OPEN' || (challenge.status === 'PENDING_ACCEPTANCE' && isAcceptor));
  const hasStreamingAccount = currentUserProfile?.streamingAccounts?.youtube?.verified || currentUserProfile?.streamingAccounts?.twitch?.verified;
  const canReject = challenge.status === 'PENDING_ACCEPTANCE' && challenge.challengeType === 'DIRECT' && isAcceptor;
  const canCancel = isCreator && (challenge.status === 'OPEN' || challenge.status === 'PENDING_ACCEPTANCE');
  const canVolunteerWitness = !isParticipant && challenge.status === 'ACCEPTED' && !challenge.witness && challenge.acceptor;
  const canUpdateStreaming = isParticipant && challenge.status === 'ACCEPTED';
  const canFlag = (challenge.status === 'LIVE' || challenge.status === 'COMPLETED') && (isCreator || isAcceptor || isWitness) && !challenge.isFlagged;
  const canDispute = challenge.status === 'COMPLETED' && (isCreator || isAcceptor) && !challenge.isDisputed && challenge.disputeDeadline && new Date(challenge.disputeDeadline) > new Date();
  const canCompleteMatch = challenge.status === 'LIVE' && isWitness && !challenge.isFlagged;
  const canSettle = challenge.status === 'COMPLETED' && isWitness && !challenge.isDisputed && !challenge.isFlagged && challenge.disputeDeadline && new Date(challenge.disputeDeadline) <= new Date();
  const showRoomCode = challenge.status === 'ACCEPTED' && challenge.witness && !challenge.matchStartedAt;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'PENDING_ACCEPTANCE':
        return 'bg-green-100 text-green-700';
      case 'ACCEPTED':
      case 'LIVE':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-700';
      case 'SETTLED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 h-14 px-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Challenge Details</h1>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-w-4xl mx-auto">
        {/* Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusColor(challenge.status)}`}>
            {challenge.status.replace(/_/g, ' ')}
          </span>
          {challenge.status === 'LIVE' && (
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-100 rounded-full">
              <Radio className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-red-600">LIVE NOW</span>
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {challenge.gameName.replace(/_/g, ' ')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">{challenge.platform}</p>
            </div>
          </div>

          {/* Players */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 py-3 sm:py-4 border-t border-gray-100">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-base sm:text-lg font-bold text-blue-600">
                  {challenge.creator.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{challenge.creator.displayName}</p>
                <p className="text-xs text-gray-500">Creator</p>
              </div>
            </div>

            <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-lg self-center flex-shrink-0">
              <span className="text-xs sm:text-sm font-bold text-gray-700">VS</span>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              {challenge.acceptor ? (
                <>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg font-bold text-red-600">
                      {challenge.acceptor.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{challenge.acceptor.displayName}</p>
                    <p className="text-xs text-gray-500">Acceptor</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-500">Open</p>
                    <p className="text-xs text-gray-400">Waiting</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stakes & Pot */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Stake</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-green-900">
                ₦{challenge.stakeAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-700">Total Pot</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-yellow-900">
                ₦{challenge.totalPot.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Match Time */}
          <div className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">Match starts: {new Date(challenge.matchStartTime).toLocaleString()}</span>
          </div>

          {/* Witness */}
          {challenge.witness && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Witness: {challenge.witness.displayName}</p>
                  {challenge.witness.witnessReputation && (
                    <p className="text-xs text-gray-600">Reputation: {challenge.witness.witnessReputation}%</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Creator Role Indicator */}
        {isCreator && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-1">You Created This Challenge</h3>
                <p className="text-sm text-blue-700 mb-3">
                  {challenge.status === 'OPEN' && 'Waiting for someone to accept your challenge.'}
                  {challenge.status === 'PENDING_ACCEPTANCE' && 'Waiting for the invited player to accept.'}
                  {challenge.status === 'ACCEPTED' && !challenge.witness && 'Waiting for a witness to volunteer.'}
                  {challenge.status === 'ACCEPTED' && challenge.witness && !challenge.roomCode && 'Share the game room code to start.'}
                  {challenge.status === 'ACCEPTED' && challenge.roomCode && !challenge.creatorJoinedRoom && 'Join the game room and confirm.'}
                  {challenge.status === 'ACCEPTED' && challenge.creatorJoinedRoom && !challenge.matchStartedAt && 'Waiting for witness to start the match.'}
                  {challenge.status === 'LIVE' && 'Match is live! Stream your gameplay.'}
                  {challenge.status === 'COMPLETED' && !challenge.isDisputed && challenge.disputeDeadline && new Date(challenge.disputeDeadline) > new Date() && 'Match completed. You can dispute if result is incorrect.'}
                  {challenge.status === 'COMPLETED' && challenge.isDisputed && 'Your dispute is under review.'}
                  {challenge.status === 'SETTLED' && 'Challenge settled.'}
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${challenge.status === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-blue-400'}`}></div>
                    <span className="font-semibold">Status: {challenge.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Acceptor Role Indicator */}
        {isAcceptor && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-green-900 mb-1">You Accepted This Challenge</h3>
                <p className="text-sm text-green-700 mb-3">
                  {challenge.status === 'PENDING_ACCEPTANCE' && 'Review the challenge and accept or reject.'}
                  {challenge.status === 'ACCEPTED' && !challenge.witness && 'Waiting for a witness to volunteer.'}
                  {challenge.status === 'ACCEPTED' && challenge.witness && !challenge.roomCode && 'Waiting for creator to share room code.'}
                  {challenge.status === 'ACCEPTED' && challenge.roomCode && !challenge.acceptorJoinedRoom && 'Join the game room and confirm.'}
                  {challenge.status === 'ACCEPTED' && challenge.acceptorJoinedRoom && !challenge.matchStartedAt && 'Waiting for witness to start the match.'}
                  {challenge.status === 'LIVE' && 'Match is live! Stream your gameplay.'}
                  {challenge.status === 'COMPLETED' && !challenge.isDisputed && challenge.disputeDeadline && new Date(challenge.disputeDeadline) > new Date() && 'Match completed. You can dispute if result is incorrect.'}
                  {challenge.status === 'COMPLETED' && challenge.isDisputed && 'Your dispute is under review.'}
                  {challenge.status === 'SETTLED' && 'Challenge settled.'}
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${challenge.status === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-green-400'}`}></div>
                    <span className="font-semibold">Status: {challenge.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Witness Role Indicator */}
        {isWitness && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-purple-900 mb-1">You are the Witness</h3>
                <p className="text-sm text-purple-700 mb-3">
                  {challenge.status === 'ACCEPTED' && !challenge.matchStartedAt && 'Wait for both players to join the room, then start the match.'}
                  {challenge.status === 'ACCEPTED' && challenge.matchStartedAt && 'Match is in progress. Monitor the streams.'}
                  {challenge.status === 'LIVE' && 'Match is live! Watch both streams and enter final scores when done.'}
                  {challenge.status === 'COMPLETED' && !challenge.isDisputed && challenge.disputeDeadline && new Date(challenge.disputeDeadline) > new Date() && 'Match completed. Waiting for dispute window to end.'}
                  {challenge.status === 'COMPLETED' && !challenge.isDisputed && challenge.disputeDeadline && new Date(challenge.disputeDeadline) <= new Date() && 'Ready to settle! Disburse funds to the winner.'}
                  {challenge.status === 'COMPLETED' && challenge.isDisputed && 'Match is under dispute. Admin will review.'}
                </p>
                <div className="flex items-center gap-2 text-xs text-purple-600">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${challenge.status === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-purple-400'}`}></div>
                    <span className="font-semibold">Status: {challenge.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room Code Section */}
        {showRoomCode && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Key className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Room Code
            </h3>

            {isCreator && (
              !challenge.roomCode ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Share the game room code to start the match</p>
                  <button
                    onClick={() => setShowRoomCodeModal(true)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Share Room Code
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">ROOM CODE</p>
                    <p className="text-2xl font-bold text-gray-900 tracking-wider">{challenge.roomCode}</p>
                  </div>

                  {/* Streaming Status for Creator */}
                  {streamingStatus && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-blue-900">Your Stream Status</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              refetchStreamingStatus();
                              toast.success('Refreshing streaming status...');
                            }}
                            disabled={isRefreshingStreaming}
                            className="p-1 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50"
                            title="Refresh streaming status"
                          >
                            <RefreshCw className={`h-4 w-4 text-blue-600 ${isRefreshingStreaming ? 'animate-spin' : ''}`} />
                          </button>
                          <div className="flex items-center gap-1">
                            {streamingStatus.creator.isLive ? (
                              <>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-600 font-semibold">LIVE</span>
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-xs text-red-600 font-semibold">OFFLINE</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-700">{streamingStatus.acceptor.displayName}</span>
                        <div className="flex items-center gap-1">
                          {streamingStatus.acceptor.isLive ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-semibold">LIVE</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-red-600 font-semibold">OFFLINE</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {challenge.creatorJoinedRoom ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">You've joined</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => confirmJoinedMutation.mutate()}
                      disabled={confirmJoinedMutation.isPending}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                    >
                      {confirmJoinedMutation.isPending ? 'Confirming...' : "I've Joined"}
                    </button>
                  )}
                </div>
              )
            )}

            {isAcceptor && (
              !challenge.roomCode ? (
                <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  <span className="text-sm">Waiting for room code...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">ROOM CODE</p>
                    <p className="text-2xl font-bold text-gray-900 tracking-wider">{challenge.roomCode}</p>
                  </div>

                  {/* Streaming Status for Acceptor */}
                  {streamingStatus && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-green-900">Your Stream Status</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              refetchStreamingStatus();
                              toast.success('Refreshing streaming status...');
                            }}
                            disabled={isRefreshingStreaming}
                            className="p-1 hover:bg-green-100 rounded-full transition-colors disabled:opacity-50"
                            title="Refresh streaming status"
                          >
                            <RefreshCw className={`h-4 w-4 text-green-600 ${isRefreshingStreaming ? 'animate-spin' : ''}`} />
                          </button>
                          <div className="flex items-center gap-1">
                            {streamingStatus.acceptor.isLive ? (
                              <>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-600 font-semibold">LIVE</span>
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-xs text-red-600 font-semibold">OFFLINE</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-700">{streamingStatus.creator.displayName}</span>
                        <div className="flex items-center gap-1">
                          {streamingStatus.creator.isLive ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-semibold">LIVE</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-red-600 font-semibold">OFFLINE</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {challenge.acceptorJoinedRoom ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">You've joined</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => confirmJoinedMutation.mutate()}
                      disabled={confirmJoinedMutation.isPending}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                    >
                      {confirmJoinedMutation.isPending ? 'Confirming...' : "I've Joined"}
                    </button>
                  )}
                </div>
              )
            )}

            {isWitness && challenge.roomCode && (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">ROOM CODE</p>
                  <p className="text-2xl font-bold text-gray-900 tracking-wider">{challenge.roomCode}</p>
                </div>

                {/* Streaming Status for Witness */}
                {streamingStatus && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-purple-900">Live Streaming Status</p>
                      <button
                        onClick={() => {
                          refetchStreamingStatus();
                          toast.success('Refreshing streaming status...');
                        }}
                        disabled={isRefreshingStreaming}
                        className="p-1 hover:bg-purple-100 rounded-full transition-colors disabled:opacity-50"
                        title="Refresh streaming status"
                      >
                        <RefreshCw className={`h-3 w-3 text-purple-600 ${isRefreshingStreaming ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{streamingStatus.creator.displayName}</span>
                        <div className="flex items-center gap-1">
                          {streamingStatus.creator.isLive ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-semibold">LIVE</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-red-600 font-semibold">OFFLINE</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{streamingStatus.acceptor.displayName}</span>
                        <div className="flex items-center gap-1">
                          {streamingStatus.acceptor.isLive ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-semibold">LIVE</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-red-600 font-semibold">OFFLINE</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!challenge.creatorJoinedRoom || !challenge.acceptorJoinedRoom ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 text-center">Waiting for players to join...</p>
                    <div className="flex justify-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        {challenge.creatorJoinedRoom ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                        )}
                        <span className="text-xs text-gray-600">Creator</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {challenge.acceptorJoinedRoom ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                        )}
                        <span className="text-xs text-gray-600">Acceptor</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowStartMatchModal(true)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Start Match
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Complete Match (Witness - LIVE) */}
        {canCompleteMatch && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Clipboard className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              Complete Match
            </h3>
            <p className="text-sm text-gray-600 mb-4">Enter the final scores to complete this match. Players will have 10 minutes to dispute.</p>
            <button
              onClick={() => setShowScoreModal(true)}
              className="w-full py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700"
            >
              Enter Final Scores
            </button>
          </div>
        )}

        {/* Dispute Result */}
        {canDispute && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200">
            <h3 className="text-base sm:text-lg font-bold text-yellow-900 flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              Dispute Result
            </h3>
            
            {/* Countdown Timer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-900">Time Remaining</span>
                </div>
                <span className="text-lg font-bold text-yellow-600 tabular-nums">
                  {disputeTimeRemaining || 'Calculating...'}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              If you believe the result is incorrect, you can dispute it before the deadline expires.
            </p>
            <button
              onClick={() => setShowDisputeModal(true)}
              className="w-full py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700"
            >
              Dispute Result
            </button>
          </div>
        )}

        {/* Settle Challenge (Witness) */}
        {canSettle && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
            <h3 className="text-base sm:text-lg font-bold text-green-900 flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              Ready to Settle
            </h3>
            <p className="text-sm text-gray-600 mb-4">The dispute window has ended. You can now settle this challenge and disburse funds.</p>
            <button
              onClick={() => settleMutation.mutate()}
              disabled={settleMutation.isPending}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {settleMutation.isPending ? 'Settling...' : 'Settle Challenge'}
            </button>
          </div>
        )}

        {/* Results */}
        {(challenge.status === 'COMPLETED' || challenge.status === 'SETTLED') && challenge.finalScore && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              Results
            </h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{challenge.creator.displayName}</p>
                <p className="text-3xl font-bold text-gray-900">{challenge.finalScore.creator}</p>
              </div>
              <span className="text-2xl font-bold text-gray-400">-</span>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{challenge.acceptor?.displayName}</p>
                <p className="text-3xl font-bold text-gray-900">{challenge.finalScore.acceptor}</p>
              </div>
            </div>
            {challenge.winner && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <p className="text-sm font-semibold text-yellow-900">
                  {challenge.winnerUsername} won ₦{challenge.winnerPayout?.toLocaleString()}!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Live Streaming Section - Visible to All Participants */}
        {streamingStatus && (streamingStatus.creator.isLive || streamingStatus.acceptor.isLive) && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <Radio className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 animate-pulse" />
                Watch Live Streams
              </h3>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 rounded-full">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-red-600">LIVE</span>
              </div>
            </div>

            {/* Show both streams side-by-side when both are live, or single stream when only one is live */}
            <div className={`grid gap-4 sm:gap-6 ${streamingStatus.creator.isLive && streamingStatus.acceptor.isLive ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              {streamingStatus.creator.isLive && streamingStatus.creator.streamUrl && (
                <div className={isCreator ? 'order-1' : 'order-2'}>
                  <StreamPlayer
                    platform={streamingStatus.creator.platform as 'YOUTUBE' | 'TWITCH'}
                    url={streamingStatus.creator.streamUrl}
                    label={`${streamingStatus.creator.displayName}'s Stream ${isCreator ? '(You)' : ''}`}
                  />
                </div>
              )}

              {streamingStatus.acceptor.isLive && streamingStatus.acceptor.streamUrl && (
                <div className={isAcceptor ? 'order-1' : 'order-2'}>
                  <StreamPlayer
                    platform={streamingStatus.acceptor.platform as 'YOUTUBE' | 'TWITCH'}
                    url={streamingStatus.acceptor.streamUrl}
                    label={`${streamingStatus.acceptor.displayName}'s Stream ${isAcceptor ? '(You)' : ''}`}
                  />
                </div>
              )}
            </div>

            {/* Info message for participants */}
            {(isCreator || isAcceptor) && streamingStatus.bothLive && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 text-center">
                  💡 You can watch both streams to ensure you're playing the same match
                </p>
              </div>
            )}

            {isWitness && streamingStatus.bothLive && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-800 text-center">
                  👁️ Monitor both streams to verify fair gameplay
                </p>
              </div>
            )}
          </div>
        )}

        {/* Streaming Section (Saved Links - Fallback) */}
        {!streamingStatus?.creator.isLive && !streamingStatus?.acceptor.isLive && 
         ((challenge.creatorStreamingLink?.platform && challenge.creatorStreamingLink?.url) || 
         (challenge.acceptorStreamingLink?.platform && challenge.acceptorStreamingLink?.url)) ? (
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Radio className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              Stream Links (Offline)
            </h3>

            {challenge.creatorStreamingLink?.platform && challenge.creatorStreamingLink?.url && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">{challenge.creator.displayName}'s Stream</p>
                <a 
                  href={challenge.creatorStreamingLink.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {challenge.creatorStreamingLink.url}
                </a>
              </div>
            )}

            {challenge.acceptorStreamingLink?.platform && challenge.acceptorStreamingLink?.url && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">{challenge.acceptor?.displayName}'s Stream</p>
                <a 
                  href={challenge.acceptorStreamingLink.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {challenge.acceptorStreamingLink.url}
                </a>
              </div>
            )}

            {canUpdateStreaming && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  {(isCreator && challenge.creatorStreamingLink) || (isAcceptor && challenge.acceptorStreamingLink)
                    ? 'Update Your Stream Link'
                    : 'Add Your Stream Link'}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => setStreamingPlatform('YOUTUBE')}
                    className={`py-2 rounded-lg font-semibold ${streamingPlatform === 'YOUTUBE' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    YouTube
                  </button>
                  <button
                    onClick={() => setStreamingPlatform('TWITCH')}
                    className={`py-2 rounded-lg font-semibold ${streamingPlatform === 'TWITCH' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Twitch
                  </button>
                </div>
                {streamingPlatform && (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={streamingUrl}
                      onChange={(e) => setStreamingUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => updateStreamingMutation.mutate({ platform: streamingPlatform, url: streamingUrl })}
                      disabled={!streamingUrl || updateStreamingMutation.isPending}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updateStreamingMutation.isPending ? 'Saving...' : 'Save Link'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* Actions */}
        <div className="space-y-2.5 sm:space-y-3">
          {canAccept && (
            <button
              onClick={() => {
                if (!hasStreamingAccount) {
                  toast.error('Please connect a streaming account first');
                  setTimeout(() => router.push('/edit-profile'), 1500);
                  return;
                }
                setShowAcceptModal(true);
              }}
              className="w-full py-3.5 sm:py-4 bg-blue-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 transition-colors"
            >
              Accept Challenge
            </button>
          )}

          {canVolunteerWitness && (
            <button
              onClick={() => volunteerWitnessMutation.mutate()}
              disabled={volunteerWitnessMutation.isPending}
              className="w-full py-3.5 sm:py-4 bg-purple-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {volunteerWitnessMutation.isPending ? 'Volunteering...' : 'Volunteer as Witness'}
            </button>
          )}

          {canFlag && (
            <button
              onClick={() => setShowFlagModal(true)}
              className="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-100 flex items-center justify-center gap-2"
            >
              <Flag className="h-4 w-4" />
              Flag Match
            </button>
          )}

          <div className="flex gap-2">
            {canReject && (
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex-1 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-100"
              >
                Reject
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
              >
                Cancel Challenge
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Accept Challenge</h3>
            <p className="text-sm text-gray-600 mb-4">
              You will stake ₦{challenge.stakeAmount.toLocaleString()}. Are you ready to compete?
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                Make sure you have your streaming account connected and ready to go live when the match starts.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {acceptMutation.isPending ? 'Accepting...' : 'Accept Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Match Modal */}
      {showStartMatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Start Match</h3>
            <p className="text-sm text-gray-600 mb-4">
              Before starting the match, please confirm both players are streaming live.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-800 font-semibold mb-2">Witness Checklist:</p>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>✓ Both players must be live streaming</li>
                <li>✓ Verify streaming links are active</li>
                <li>✓ Ensure you can view both streams clearly</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowStartMatchModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => startMatchMutation.mutate()}
                disabled={startMatchMutation.isPending}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {startMatchMutation.isPending ? 'Starting...' : 'Start Match'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Reject Challenge</h3>
            <p className="text-sm text-gray-600 mb-4">The creator will be fully refunded their stake.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
              >
                Go Back
              </button>
              <button
                onClick={() => rejectMutation.mutate()}
                disabled={rejectMutation.isPending}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Cancel Challenge</h3>
            <p className="text-sm text-gray-600 mb-4">Your stake will be returned to your wallet.</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
              >
                Go Back
              </button>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="flex-1 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Code Modal */}
      {showRoomCodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
              {challenge.roomCode ? 'Update Room Code' : 'Share Room Code'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">Enter the game room code for players to join</p>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ROOM CODE"
              className="w-full px-4 py-3 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 tracking-wider uppercase"
              maxLength={20}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowRoomCodeModal(false);
                  setRoomCode('');
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!roomCode.trim()) {
                    toast.error('Please enter a room code');
                    return;
                  }
                  shareRoomCodeMutation.mutate(roomCode.trim());
                }}
                disabled={!roomCode.trim() || shareRoomCodeMutation.isPending}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {shareRoomCodeMutation.isPending ? 'Sharing...' : challenge.roomCode ? 'Update' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score Entry Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Enter Final Scores</h3>
            <p className="text-sm text-gray-600 mb-4">Enter the final score for each player</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {challenge.creator.displayName} (Creator)
                </label>
                <input
                  type="number"
                  value={creatorScore}
                  onChange={(e) => setCreatorScore(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="99"
                  className="w-full px-4 py-3 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {challenge.acceptor?.displayName} (Acceptor)
                </label>
                <input
                  type="number"
                  value={acceptorScore}
                  onChange={(e) => setAcceptorScore(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="99"
                  className="w-full px-4 py-3 text-center text-2xl font-bold border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowScoreModal(false);
                  setCreatorScore('');
                  setAcceptorScore('');
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const creator = parseInt(creatorScore);
                  const acceptor = parseInt(acceptorScore);
                  if (isNaN(creator) || isNaN(acceptor)) {
                    toast.error('Please enter valid scores for both players');
                    return;
                  }
                  if (creator < 0 || acceptor < 0) {
                    toast.error('Scores cannot be negative');
                    return;
                  }
                  if (creator > 99 || acceptor > 99) {
                    toast.error('Scores seem unrealistic. Please verify.');
                    return;
                  }
                  completeMatchMutation.mutate({ creatorScore: creator, acceptorScore: acceptor });
                }}
                disabled={!creatorScore || !acceptorScore || completeMatchMutation.isPending}
                className="flex-1 py-2.5 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50"
              >
                {completeMatchMutation.isPending ? 'Completing...' : 'Complete Match'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Match Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Flag This Match</h3>
            <p className="text-sm text-gray-600 mb-4">Report suspicious activity or rule violations</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-800">Only flag for genuine issues. False reports may result in account penalties.</p>
            </div>
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="What did you observe? Include specific details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">{flagReason.trim().length}/10 min characters</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason('');
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (flagReason.trim().length < 10) {
                    toast.error('Please provide a detailed reason (minimum 10 characters)');
                    return;
                  }
                  flagMatchMutation.mutate(flagReason.trim());
                }}
                disabled={flagReason.trim().length < 10 || flagMatchMutation.isPending}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {flagMatchMutation.isPending ? 'Submitting...' : 'Submit Flag'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Dispute Result</h3>
            <p className="text-sm text-gray-600 mb-4">Challenge the outcome within the dispute window</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-800">Provide clear evidence. Frivolous disputes may affect your account standing.</p>
            </div>
            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Explain in detail why the result is wrong. Reference timestamps or other evidence..."
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">{disputeReason.trim().length}/20 min characters</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  setDisputeReason('');
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (disputeReason.trim().length < 20) {
                    toast.error('Please provide a detailed reason (minimum 20 characters)');
                    return;
                  }
                  disputeMatchMutation.mutate(disputeReason.trim());
                }}
                disabled={disputeReason.trim().length < 20 || disputeMatchMutation.isPending}
                className="flex-1 py-2.5 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50"
              >
                {disputeMatchMutation.isPending ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}