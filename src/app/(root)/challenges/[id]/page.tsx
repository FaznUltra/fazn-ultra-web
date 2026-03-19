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
import { Challenge, ChallengeStatus, StreamingPlatform } from '@/types/challenge';
import { userService } from '@/services/user.service';
import { PrivateChatRoom } from '@/components/PrivateChatRoom';
import { CommunityChat } from '@/components/CommunityChat';
import { PhoneVerification } from '@/components/PhoneVerification';
import { spectatingService } from '@/services/spectating.service';

interface ChallengeDetailPageProps {
  params: Promise<{ id: string }>;
}

type ChallengeWithSpectating = Challenge & {
  spectating?: {
    spectatorCount?: number;
    lastJoinedAt?: string;
  };
};

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
    refetchInterval: 10000,
  });

  const challenge = data?.data?.challenge as ChallengeWithSpectating | undefined;
  const currentUserProfile = userProfileData?.data?.user;
  const streamingStatus = streamingStatusData?.data;

  const formatCurrency = (value?: number | null) =>
    typeof value === 'number'
      ? new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          maximumFractionDigits: 0,
        }).format(value)
      : '—';

  const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleString() : '—';

  const heroStats = [
    {
      label: 'Entry Stake',
      value: formatCurrency(challenge?.stakeAmount),
      hint: 'Per player',
      accent: 'from-[#00FFB2]/20 to-transparent',
      color: '#00FFB2',
    },
    {
      label: 'Total Pot',
      value: formatCurrency(challenge?.totalPot),
      hint: challenge?.acceptor ? 'Winner takes all' : 'Open challenge',
      accent: 'from-[#FBCB4A]/20 to-transparent',
      color: '#FBCB4A',
    },
    {
      label: 'Match Start',
      value: formatDate(challenge?.matchStartTime),
      hint: 'Local timezone',
      accent: 'from-[#7C8CFF]/20 to-transparent',
      color: '#7C8CFF',
    },
    {
      label: 'Dispute Deadline',
      value: formatDate(challenge?.disputeDeadline),
      hint: challenge?.disputeDeadline ? 'Auto-settle after window' : 'Pending scores',
      accent: 'from-[#FF61D6]/20 to-transparent',
      color: '#FF61D6',
    },
  ];

  const acceptanceDeadlineRaw = (challenge as any)?.acceptanceDueDate || (challenge as any)?.acceptDeadline;
  const timeline = [
    { label: 'Challenge Created', value: formatDate(challenge?.createdAt) },
    { label: 'Acceptance Deadline', value: formatDate(acceptanceDeadlineRaw) },
    { label: 'Match Start', value: formatDate(challenge?.matchStartTime) },
    { label: 'Dispute Deadline', value: formatDate(challenge?.disputeDeadline) },
  ];

  const spectatorCount = challenge?.spectating?.spectatorCount ?? 0;

  // Dispute countdown timer
  useEffect(() => {
    if (!challenge?.disputeDeadline) return;
    const updateCountdown = () => {
      const now = new Date().getTime();
      const deadline = new Date(challenge.disputeDeadline!).getTime();
      const timeLeft = deadline - now;
      if (timeLeft <= 0) { setDisputeTimeRemaining('Expired'); return; }
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      if (hours > 0) setDisputeTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      else if (minutes > 0) setDisputeTimeRemaining(`${minutes}m ${seconds}s`);
      else setDisputeTimeRemaining(`${seconds}s`);
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
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to accept challenge'),
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
      if (errorMessage.includes('phone number')) setShowPhoneVerificationModal(true);
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

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#03060b] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/10" style={{ borderTopColor: '#00FFB2' }} />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#03060b] flex flex-col items-center justify-center p-4 text-white">
        <div className="rounded-3xl border border-white/5 bg-white/[0.04] p-10 flex flex-col items-center text-center max-w-sm">
          <AlertCircle className="h-12 w-12 mb-4" style={{ color: '#FF6B6B' }} />
          <h2 className="text-xl font-bold mb-2">Challenge Not Found</h2>
          <p className="text-white/60 text-sm mb-6">This challenge may have been deleted or doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: '#00FFB2', color: '#05070b' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ─── Derived roles ─────────────────────────────────────────────────────────
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

  // ─── Status theme ──────────────────────────────────────────────────────────
  const statusTokens: Record<string, { label: string; color: string; bg: string }> = {
    OPEN:               { label: 'Open',               color: '#00FFB2', bg: 'rgba(0,255,178,0.12)' },
    PENDING_ACCEPTANCE: { label: 'Pending Acceptance',  color: '#FBCB4A', bg: 'rgba(251,203,74,0.12)' },
    ACCEPTED:           { label: 'Accepted',            color: '#7C8CFF', bg: 'rgba(124,140,255,0.12)' },
    LIVE:               { label: 'Live',                color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)' },
    IN_PROGRESS:        { label: 'In Progress',         color: '#7C8CFF', bg: 'rgba(124,140,255,0.12)' },
    COMPLETED:          { label: 'Completed',           color: '#FF61D6', bg: 'rgba(255,97,214,0.12)' },
    SETTLED:            { label: 'Settled',             color: '#00FFB2', bg: 'rgba(0,255,178,0.12)' },
    REJECTED:           { label: 'Rejected',            color: '#F87171', bg: 'rgba(248,113,113,0.12)' },
    CANCELLED:          { label: 'Cancelled',           color: '#F87171', bg: 'rgba(248,113,113,0.12)' },
    DISPUTED:           { label: 'Disputed',            color: '#FF9F43', bg: 'rgba(255,159,67,0.12)' },
    FLAGGED:            { label: 'Flagged',             color: '#FF9F43', bg: 'rgba(255,159,67,0.12)' },
  };
  const statusTheme = statusTokens[challenge.status] || { label: challenge.status, color: '#ffffff', bg: 'rgba(255,255,255,0.08)' };

  // ─── Shared panel style ────────────────────────────────────────────────────
  const panel = 'rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl';
  const modalOverlay = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50';
  const modalBox = 'rounded-2xl border border-white/[0.08] bg-[#0d1117] text-white p-6 max-w-md w-full shadow-2xl';
  const inputClass = 'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/40 focus:border-[#00FFB2]/40 transition-colors';
  const textareaClass = `${inputClass} resize-none`;
  const btnPrimary = 'flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]';
  const btnGhost = 'flex-1 py-2.5 rounded-xl font-semibold text-sm border border-white/10 text-white/70 hover:bg-white/[0.05] transition-all';

  return (
    <div className="min-h-screen bg-[#03060b] text-white pb-24">
      {/* ── Back nav ── */}
      <div className="sticky top-0 z-40 border-b border-white/[0.05] bg-[#03060b]/80 backdrop-blur-lg">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
          <span className="text-sm font-semibold text-white/80">Challenge Detail</span>
          <div className="ml-auto">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold tracking-wide"
              style={{ color: statusTheme.color, background: statusTheme.bg }}
            >
              {statusTheme.label}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* ── Hero card ── */}
        <div className={`${panel} overflow-hidden`}>
          {/* gradient top stripe */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${statusTheme.color}80, transparent)` }} />
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">{challenge.gameType || 'Gaming Challenge'}</p>
                <h1 className="text-xl sm:text-2xl font-bold leading-tight">{challenge.gameName.replace(/_/g, ' ')}</h1>
                <p className="text-xs text-white/40 mt-1">{challenge.platform} • {challenge.challengeType}</p>
              </div>
              {challenge.status === 'LIVE' && (
                <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,107,107,0.15)' }}>
                  <div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full animate-pulse" />
                  <span className="text-[11px] font-bold text-[#FF6B6B]">LIVE</span>
                </div>
              )}
            </div>

            {/* Players row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#00FFB2]/30 to-[#7C8CFF]/30 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-[#00FFB2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/40">Creator</p>
                  <p className="text-sm font-semibold truncate">{challenge.creator.displayName}</p>
                </div>
              </div>

              <div className="text-white/20 text-xl font-light">vs</div>

              <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
                <div className="min-w-0 text-right">
                  <p className="text-xs text-white/40">Acceptor</p>
                  <p className="text-sm font-semibold truncate">
                    {challenge.acceptor?.displayName || <span className="text-white/30 italic">Open</span>}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: challenge.acceptor ? 'linear-gradient(135deg,rgba(251,203,74,0.3),rgba(255,97,214,0.3))' : 'rgba(255,255,255,0.05)' }}>
                  {challenge.acceptor ? <User className="h-4 w-4 text-[#FBCB4A]" /> : <Users className="h-4 w-4 text-white/30" />}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {heroStats.map((stat) => (
                <div key={stat.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent}`} />
                  <p className="text-[11px] uppercase tracking-wider mb-1 relative" style={{ color: stat.color }}>
                    {stat.label}
                  </p>
                  <p className="text-base font-bold relative text-white leading-tight">{stat.value}</p>
                  <p className="text-[11px] text-white/30 mt-0.5 relative">{stat.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Witness banner ── */}
        {isWitness && (
          <div className={`${panel} border-[#9B59FF]/20 bg-[#9B59FF]/[0.05] p-4 sm:p-5 flex items-start gap-3`}>
            <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(155,89,255,0.2)' }}>
              <Eye className="h-4 w-4" style={{ color: '#9B59FF' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold mb-0.5" style={{ color: '#c4a0ff' }}>You are the Witness</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                {challenge.status === 'ACCEPTED' && !challenge.matchStartedAt && 'Wait for both players to join the room, then start the match.'}
                {challenge.status === 'ACCEPTED' && challenge.matchStartedAt && 'Match is in progress. Monitor the streams.'}
                {challenge.status === 'LIVE' && 'Match is live! Watch both streams and enter final scores when done.'}
                {challenge.status === 'COMPLETED' && !challenge.isDisputed && challenge.disputeDeadline && new Date(challenge.disputeDeadline) > new Date() && 'Match completed. Waiting for dispute window to end.'}
                {challenge.status === 'COMPLETED' && !challenge.isDisputed && challenge.disputeDeadline && new Date(challenge.disputeDeadline) <= new Date() && 'Ready to settle! Disburse funds to the winner.'}
                {challenge.status === 'COMPLETED' && challenge.isDisputed && 'Match is under dispute. Admin will review.'}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className={`w-1.5 h-1.5 rounded-full ${challenge.status === 'LIVE' ? 'bg-green-400 animate-pulse' : 'bg-[#9B59FF]/60'}`} />
                <span className="text-[11px] text-white/40 font-medium">Status: {challenge.status}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Room Code ── */}
        {showRoomCode && (
          <div className={`${panel} p-4 sm:p-5`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-white/90">
              <Key className="h-4 w-4 text-[#FBCB4A]" />
              Room Code
            </h3>

            {isCreator && (
              !challenge.roomCode ? (
                <div className="space-y-3">
                  <p className="text-xs text-white/50">Share the game room code to start the match</p>
                  <button
                    onClick={() => setShowRoomCodeModal(true)}
                    className="w-full py-3 rounded-xl font-semibold text-sm"
                    style={{ background: '#FBCB4A', color: '#05070b' }}
                  >
                    Share Room Code
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => confirmJoinedMutation.mutate()}
                  disabled={confirmJoinedMutation.isPending}
                  className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-50 transition-opacity"
                  style={{ background: '#00FFB2', color: '#05070b' }}
                >
                  {confirmJoinedMutation.isPending ? 'Confirming...' : "I've Joined"}
                </button>
              )
            )}

            {isAcceptor && challenge.roomCode && (
              <div className="space-y-3">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Room Code</p>
                  <p className="text-3xl font-black tracking-[0.2em] text-[#00FFB2]">{challenge.roomCode}</p>
                </div>
                <button
                  onClick={() => confirmJoinedMutation.mutate()}
                  disabled={confirmJoinedMutation.isPending}
                  className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
                  style={{ background: '#00FFB2', color: '#05070b' }}
                >
                  {confirmJoinedMutation.isPending ? 'Confirming...' : "I've Joined"}
                </button>
              </div>
            )}

            {isWitness && challenge.roomCode && (
              <div className="space-y-3">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Room Code</p>
                  <p className="text-3xl font-black tracking-[0.2em] text-[#00FFB2]">{challenge.roomCode}</p>
                </div>

                {streamingStatus && (
                  <div className="rounded-xl border border-[#9B59FF]/20 bg-[#9B59FF]/[0.06] p-3">
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#c4a0ff]">Streaming Status</p>
                      <button
                        onClick={() => { refetchStreamingStatus(); toast.success('Refreshing...'); }}
                        disabled={isRefreshingStreaming}
                        className="p-1 rounded-lg hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 text-white/40 ${isRefreshingStreaming ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: streamingStatus.creator.displayName, isLive: streamingStatus.creator.isLive },
                        { name: streamingStatus.acceptor.displayName, isLive: streamingStatus.acceptor.isLive },
                      ].map((p) => (
                        <div key={p.name} className="flex items-center justify-between">
                          <span className="text-xs text-white/70">{p.name}</span>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${p.isLive ? 'bg-[#00FFB2] animate-pulse' : 'bg-red-500/60'}`} />
                            <span className={`text-[11px] font-bold ${p.isLive ? 'text-[#00FFB2]' : 'text-red-400'}`}>
                              {p.isLive ? 'LIVE' : 'OFFLINE'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!challenge.creatorJoinedRoom || !challenge.acceptorJoinedRoom ? (
                  <div className="rounded-xl border border-[#FBCB4A]/20 bg-[#FBCB4A]/[0.06] p-3">
                    <p className="text-xs text-[#FBCB4A]/80 text-center mb-2">Waiting for players to join...</p>
                    <div className="flex justify-center gap-6">
                      {[
                        { label: 'Creator', joined: challenge.creatorJoinedRoom },
                        { label: 'Acceptor', joined: challenge.acceptorJoinedRoom },
                      ].map((p) => (
                        <div key={p.label} className="flex items-center gap-1.5">
                          {p.joined
                            ? <CheckCircle className="h-4 w-4 text-[#00FFB2]" />
                            : <div className="h-4 w-4 rounded-full border-2 border-white/20" />
                          }
                          <span className="text-xs text-white/50">{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowStartMatchModal(true)}
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: '#7C8CFF', color: '#fff' }}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Start Match
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Complete Match ── */}
        {canCompleteMatch && (
          <div className={`${panel} p-4 sm:p-5`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3 text-white/90">
              <Clipboard className="h-4 w-4 text-[#FBCB4A]" />
              Complete Match
            </h3>
            <p className="text-xs text-white/40 mb-4 leading-relaxed">Enter the final scores to complete this match. Players will have 10 minutes to dispute.</p>
            <button
              onClick={() => setShowScoreModal(true)}
              className="w-full py-3 rounded-xl font-semibold text-sm"
              style={{ background: '#FBCB4A', color: '#05070b' }}
            >
              Enter Final Scores
            </button>
          </div>
        )}

        {/* ── Dispute Result ── */}
        {canDispute && (
          <div className={`${panel} border-[#FF9F43]/20 bg-[#FF9F43]/[0.04] p-4 sm:p-5`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: '#FFB870' }}>
              <AlertCircle className="h-4 w-4 text-[#FF9F43]" />
              Dispute Result
            </h3>
            <div className="rounded-xl border border-[#FF9F43]/20 bg-[#FF9F43]/[0.08] p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#FF9F43]" />
                <span className="text-xs font-semibold text-[#FF9F43]/80">Time Remaining</span>
              </div>
              <span className="text-base font-black text-[#FF9F43] tabular-nums">
                {disputeTimeRemaining || 'Calculating...'}
              </span>
            </div>
            <p className="text-xs text-white/40 mb-4 leading-relaxed">
              If you believe the result is incorrect, you can dispute it before the deadline expires.
            </p>
            <button
              onClick={() => setShowDisputeModal(true)}
              className="w-full py-3 rounded-xl font-semibold text-sm"
              style={{ background: '#FF9F43', color: '#fff' }}
            >
              Dispute Result
            </button>
          </div>
        )}

        {/* ── Settle ── */}
        {canSettle && (
          <div className={`${panel} border-[#00FFB2]/20 bg-[#00FFB2]/[0.04] p-4 sm:p-5`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3 text-[#00FFB2]">
              <CheckCircle className="h-4 w-4" />
              Ready to Settle
            </h3>
            <p className="text-xs text-white/40 mb-4 leading-relaxed">The dispute window has ended. You can now settle this challenge and disburse funds.</p>
            <button
              onClick={() => settleMutation.mutate()}
              disabled={settleMutation.isPending}
              className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
              style={{ background: '#00FFB2', color: '#05070b' }}
            >
              {settleMutation.isPending ? 'Settling...' : 'Settle Challenge'}
            </button>
          </div>
        )}

        {/* ── Results ── */}
        {(challenge.status === 'COMPLETED' || challenge.status === 'SETTLED') && challenge.finalScore && (
          <div className={`${panel} p-4 sm:p-6`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-5 text-white/90">
              <Trophy className="h-4 w-4 text-[#FBCB4A]" />
              Results
            </h3>
            <div className="flex items-center justify-center gap-6 mb-5">
              <div className="text-center">
                <p className="text-xs text-white/40 mb-1">{challenge.creator.displayName}</p>
                <p className="text-5xl font-black text-white">{challenge.finalScore.creator}</p>
              </div>
              <span className="text-2xl font-light text-white/20">—</span>
              <div className="text-center">
                <p className="text-xs text-white/40 mb-1">{challenge.acceptor?.displayName}</p>
                <p className="text-5xl font-black text-white">{challenge.finalScore.acceptor}</p>
              </div>
            </div>
            {challenge.winner && (
              <div className="rounded-xl border border-[#FBCB4A]/20 bg-[#FBCB4A]/[0.08] p-3 flex items-center justify-center gap-2">
                <Trophy className="h-4 w-4 text-[#FBCB4A]" />
                <p className="text-sm font-bold text-[#FBCB4A]">
                  {challenge.winnerUsername} won ₦{challenge.winnerPayout?.toLocaleString()}!
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Live Streams ── */}
        {streamingStatus && (streamingStatus.creator.isLive || streamingStatus.acceptor.isLive) && (
          <div className={`${panel} p-4 sm:p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2 text-white/90">
                <Radio className="h-4 w-4 text-[#FF6B6B] animate-pulse" />
                Watch Live Streams
              </h3>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(255,107,107,0.15)' }}>
                <div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-[#FF6B6B]">LIVE</span>
              </div>
            </div>
            <div className={`grid gap-4 ${streamingStatus.creator.isLive && streamingStatus.acceptor.isLive ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              {streamingStatus.creator.isLive && streamingStatus.creator.streamUrl && (
                <div className={isCreator ? 'order-1' : 'order-2'}>
                  <StreamPlayer
                    platform={streamingStatus.creator.platform as 'YOUTUBE' | 'TWITCH'}
                    url={streamingStatus.creator.streamUrl}
                    label={`${streamingStatus.creator.displayName}'s Stream${isCreator ? ' (You)' : ''}`}
                  />
                </div>
              )}
              {streamingStatus.acceptor.isLive && streamingStatus.acceptor.streamUrl && (
                <div className={isAcceptor ? 'order-1' : 'order-2'}>
                  <StreamPlayer
                    platform={streamingStatus.acceptor.platform as 'YOUTUBE' | 'TWITCH'}
                    url={streamingStatus.acceptor.streamUrl}
                    label={`${streamingStatus.acceptor.displayName}'s Stream${isAcceptor ? ' (You)' : ''}`}
                  />
                </div>
              )}
            </div>
            {(isCreator || isAcceptor) && streamingStatus.bothLive && (
              <div className="rounded-xl border border-[#7C8CFF]/20 bg-[#7C8CFF]/[0.06] p-3">
                <p className="text-xs text-[#7C8CFF]/80 text-center">💡 Watch both streams to ensure you're playing the same match</p>
              </div>
            )}
            {isWitness && streamingStatus.bothLive && (
              <div className="rounded-xl border border-[#9B59FF]/20 bg-[#9B59FF]/[0.06] p-3">
                <p className="text-xs text-[#c4a0ff]/80 text-center">👁️ Monitor both streams to verify fair gameplay</p>
              </div>
            )}
          </div>
        )}

        {/* ── Saved stream links (offline fallback) ── */}
        {!streamingStatus?.creator.isLive && !streamingStatus?.acceptor.isLive &&
          ((challenge.creatorStreamingLink?.platform && challenge.creatorStreamingLink?.url) ||
           (challenge.acceptorStreamingLink?.platform && challenge.acceptorStreamingLink?.url)) && (
          <div className={`${panel} p-4 sm:p-5 space-y-4`}>
            <h3 className="text-sm font-bold flex items-center gap-2 text-white/90">
              <Radio className="h-4 w-4 text-white/30" />
              Stream Links <span className="text-[11px] font-normal text-white/30">(Offline)</span>
            </h3>
            {challenge.creatorStreamingLink?.url && (
              <div>
                <p className="text-xs font-semibold text-white/60 mb-1">{challenge.creator.displayName}</p>
                <a href={challenge.creatorStreamingLink.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[#7C8CFF] hover:underline break-all">
                  {challenge.creatorStreamingLink.url}
                </a>
              </div>
            )}
            {challenge.acceptorStreamingLink?.url && (
              <div>
                <p className="text-xs font-semibold text-white/60 mb-1">{challenge.acceptor?.displayName}</p>
                <a href={challenge.acceptorStreamingLink.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[#7C8CFF] hover:underline break-all">
                  {challenge.acceptorStreamingLink.url}
                </a>
              </div>
            )}
            {canUpdateStreaming && (
              <div className="border-t border-white/[0.06] pt-4">
                <p className="text-xs font-semibold text-white/60 mb-3">
                  {(isCreator && challenge.creatorStreamingLink) || (isAcceptor && challenge.acceptorStreamingLink)
                    ? 'Update Your Stream Link' : 'Add Your Stream Link'}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {(['YOUTUBE', 'TWITCH'] as StreamingPlatform[]).map((p) => (
                    <button key={p}
                      onClick={() => setStreamingPlatform(p)}
                      className="py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: streamingPlatform === p
                          ? p === 'YOUTUBE' ? '#FF0000' : '#9146FF'
                          : 'rgba(255,255,255,0.06)',
                        color: streamingPlatform === p ? '#fff' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {p === 'YOUTUBE' ? 'YouTube' : 'Twitch'}
                    </button>
                  ))}
                </div>
                {streamingPlatform && (
                  <div className="space-y-2">
                    <input type="url" value={streamingUrl} onChange={(e) => setStreamingUrl(e.target.value)}
                      placeholder="https://..." className={inputClass} />
                    <button
                      onClick={() => updateStreamingMutation.mutate({ platform: streamingPlatform, url: streamingUrl })}
                      disabled={!streamingUrl || updateStreamingMutation.isPending}
                      className="w-full py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50"
                      style={{ background: '#00FFB2', color: '#05070b' }}
                    >
                      {updateStreamingMutation.isPending ? 'Saving...' : 'Save Link'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Timeline ── */}
        <div className={`${panel} p-4 sm:p-5`}>
          <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4">Timeline</h3>
          <div className="space-y-3">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between gap-2">
                  <span className="text-xs text-white/40">{t.label}</span>
                  <span className="text-xs text-white/70 font-medium text-right">{t.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA Actions ── */}
        <div className="space-y-2.5">
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
              className="w-full py-4 rounded-2xl font-bold text-base tracking-wide"
              style={{ background: '#00FFB2', color: '#05070b' }}
            >
              Accept Challenge
            </button>
          )}

          {canVolunteerWitness && (
            <button
              onClick={() => volunteerWitnessMutation.mutate()}
              disabled={volunteerWitnessMutation.isPending}
              className="w-full py-4 rounded-2xl font-bold text-base disabled:opacity-50"
              style={{ background: '#9B59FF', color: '#fff' }}
            >
              {volunteerWitnessMutation.isPending ? 'Volunteering...' : 'Volunteer as Witness'}
            </button>
          )}

          {canFlag && (
            <button
              onClick={() => setShowFlagModal(true)}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border border-[#FF6B6B]/30 text-[#FF6B6B] hover:bg-[#FF6B6B]/[0.08] transition-colors"
            >
              <Flag className="h-4 w-4" />
              Flag Match
            </button>
          )}

          <div className="flex gap-2">
            {canReject && (
              <button onClick={() => setShowRejectModal(true)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm border border-[#F87171]/30 text-[#F87171] hover:bg-[#F87171]/[0.08] transition-colors">
                Reject
              </button>
            )}
            {canCancel && (
              <button onClick={() => setShowCancelModal(true)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm border border-white/10 text-white/50 hover:bg-white/[0.05] transition-colors">
                Cancel Challenge
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════ MODALS ════════════════════════ */}

      {/* Accept */}
      {showAcceptModal && (
        <div className={modalOverlay}>
          <div className={modalBox}>
            <h3 className="text-lg font-bold mb-2">Accept Challenge</h3>
            <p className="text-sm text-white/50 mb-4">You will stake <span className="text-[#FBCB4A] font-bold">₦{challenge.stakeAmount.toLocaleString()}</span>. Are you ready to compete?</p>
            <div className="rounded-xl border border-[#7C8CFF]/20 bg-[#7C8CFF]/[0.06] p-3 mb-5">
              <p className="text-xs text-[#7C8CFF]/80">Make sure your streaming account is connected and ready to go live when the match starts.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAcceptModal(false)} className={btnGhost}>Cancel</button>
              <button onClick={() => acceptMutation.mutate()} disabled={acceptMutation.isPending}
                className={btnPrimary} style={{ background: '#00FFB2', color: '#05070b' }}>
                {acceptMutation.isPending ? 'Accepting...' : 'Accept Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Match */}
      {showStartMatchModal && (
        <div className={modalOverlay}>
          <div className={modalBox}>
            <h3 className="text-lg font-bold mb-2">Start Match</h3>
            <p className="text-sm text-white/50 mb-4">Confirm both players are streaming live before starting.</p>
            <div className="rounded-xl border border-[#FBCB4A]/20 bg-[#FBCB4A]/[0.06] p-3 mb-5">
              <p className="text-xs font-semibold text-[#FBCB4A]/80 mb-2">Witness Checklist</p>
              <ul className="text-xs text-white/50 space-y-1">
                <li>✓ Both players must be live streaming</li>
                <li>✓ Verify streaming links are active</li>
                <li>✓ Ensure you can view both streams clearly</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowStartMatchModal(false)} className={btnGhost}>Cancel</button>
              <button onClick={() => startMatchMutation.mutate()} disabled={startMatchMutation.isPending}
                className={btnPrimary} style={{ background: '#7C8CFF', color: '#fff' }}>
                {startMatchMutation.isPending ? 'Starting...' : 'Start Match'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject */}
      {showRejectModal && (
        <div className={modalOverlay}>
          <div className={modalBox}>
            <h3 className="text-lg font-bold mb-2">Reject Challenge</h3>
            <p className="text-sm text-white/50 mb-4">The creator will be fully refunded their stake.</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason (optional)" className={textareaClass} rows={3} />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowRejectModal(false)} className={btnGhost}>Go Back</button>
              <button onClick={() => rejectMutation.mutate()} disabled={rejectMutation.isPending}
                className={btnPrimary} style={{ background: '#F87171', color: '#fff' }}>
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel */}
      {showCancelModal && (
        <div className={modalOverlay}>
          <div className={modalBox}>
            <h3 className="text-lg font-bold mb-2">Cancel Challenge</h3>
            <p className="text-sm text-white/50 mb-4">Your stake will be returned to your wallet.</p>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason (optional)" className={textareaClass} rows={3} />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowCancelModal(false)} className={btnGhost}>Go Back</button>
              <button onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}
                className={btnPrimary} style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Code */}
      {showRoomCodeModal && (
        <div className={modalOverlay}>
          <div className={modalBox}>
            <h3 className="text-lg font-bold mb-2">{challenge.roomCode ? 'Update Room Code' : 'Share Room Code'}</h3>
            <p className="text-sm text-white/50 mb-4">Enter the game room code for players to join</p>
            <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ROOM CODE" maxLength={20}
              className={`${inputClass} text-center text-2xl font-black tracking-[0.25em] uppercase`} />
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setShowRoomCodeModal(false); setRoomCode(''); }} className={btnGhost}>Cancel</button>
              <button
                onClick={() => { if (!roomCode.trim()) { toast.error('Please enter a room code'); return; } shareRoomCodeMutation.mutate(roomCode.trim()); }}
                disabled={!roomCode.trim() || shareRoomCodeMutation.isPending}
                className={btnPrimary} style={{ background: '#00FFB2', color: '#05070b' }}>
                {shareRoomCodeMutation.isPending ? 'Sharing...' : challenge.roomCode ? 'Update' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score */}
      {showScoreModal && (
        <div className={modalOverlay}>
          <div className={modalBox}>
            <h3 className="text-lg font-bold mb-2">Enter Final Scores</h3>
            <p className="text-sm text-white/50 mb-5">Enter the final score for each player</p>
            <div className="space-y-4">
              {[
                { label: `${challenge.creator.displayName} (Creator)`, val: creatorScore, setVal: setCreatorScore, color: '#00FFB2' },
                { label: `${challenge.acceptor?.displayName} (Acceptor)`, val: acceptorScore, setVal: setAcceptorScore, color: '#FF61D6' },
              ].map((p) => (
                <div key={p.label}>
                  <label className="block text-xs font-semibold text-white/50 mb-2">{p.label}</label>
                  <input type="number" value={p.val} onChange={(e) => p.setVal(e.target.value)}
                    placeholder="0" min="0" max="99"
                    className={`${inputClass} text-center text-4xl font-black`}
                    style={{ borderColor: `${p.color}30`, color: p.color }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => { setShowScoreModal(false); setCreatorScore(''); setAcceptorScore(''); }} className={btnGhost}>Cancel</button>
              <button
                onClick={() => {
                  const c = parseInt(creatorScore), a = parseInt(acceptorScore);
                  if (isNaN(c) || isNaN(a)) { toast.error('Please enter valid scores for both players'); return; }
                  if (c < 0 || a < 0) { toast.error('Scores cannot be negative'); return; }
                  if (c > 99 || a > 99) { toast.error('Scores seem unrealistic. Please verify.'); return; }
                  completeMatchMutation.mutate({ creatorScore: c, acceptorScore: a });
                }}
                disabled={!creatorScore || !acceptorScore || completeMatchMutation.isPending}
                className={btnPrimary} style={{ background: '#FBCB4A', color: '#05070b' }}>
                {completeMatchMutation.isPending ? 'Completing...' : 'Complete Match'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag */}
      {showFlagModal && (
        <div className={modalOverlay}>
          <div className={modalBox}>
            <h3 className="text-lg font-bold mb-2">Flag This Match</h3>
            <p className="text-sm text-white/50 mb-4">Report suspicious activity or rule violations</p>
            <div className="rounded-xl border border-[#F87171]/20 bg-[#F87171]/[0.06] p-3 mb-4">
              <p className="text-xs text-[#F87171]/80">Only flag for genuine issues. False reports may result in account penalties.</p>
            </div>
            <textarea value={flagReason} onChange={(e) => setFlagReason(e.target.value)}
              placeholder="What did you observe? Include specific details..." className={textareaClass} rows={4} />
            <p className="text-[11px] text-white/30 mt-1">{flagReason.trim().length}/10 min characters</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setShowFlagModal(false); setFlagReason(''); }} className={btnGhost}>Cancel</button>
              <button
                onClick={() => { if (flagReason.trim().length < 10) { toast.error('Please provide a detailed reason (minimum 10 characters)'); return; } flagMatchMutation.mutate(flagReason.trim()); }}
                disabled={flagReason.trim().length < 10 || flagMatchMutation.isPending}
                className={btnPrimary} style={{ background: '#F87171', color: '#fff' }}>
                {flagMatchMutation.isPending ? 'Submitting...' : 'Submit Flag'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute */}
      {showDisputeModal && (
        <div className={modalOverlay}>
          <div className={modalBox}>
            <h3 className="text-lg font-bold mb-2">Dispute Result</h3>
            <p className="text-sm text-white/50 mb-4">Challenge the outcome within the dispute window</p>
            <div className="rounded-xl border border-[#FF9F43]/20 bg-[#FF9F43]/[0.06] p-3 mb-4">
              <p className="text-xs text-[#FF9F43]/80">Provide clear evidence. Frivolous disputes may affect your account standing.</p>
            </div>
            <textarea value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Explain in detail why the result is wrong. Reference timestamps or other evidence..."
              className={textareaClass} rows={4} />
            <p className="text-[11px] text-white/30 mt-1">{disputeReason.trim().length}/20 min characters</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setShowDisputeModal(false); setDisputeReason(''); }} className={btnGhost}>Cancel</button>
              <button
                onClick={() => { if (disputeReason.trim().length < 20) { toast.error('Please provide a detailed reason (minimum 20 characters)'); return; } disputeMatchMutation.mutate(disputeReason.trim()); }}
                disabled={disputeReason.trim().length < 20 || disputeMatchMutation.isPending}
                className={btnPrimary} style={{ background: '#FF9F43', color: '#fff' }}>
                {disputeMatchMutation.isPending ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Verification */}
      {showPhoneVerificationModal && (
        <PhoneVerification onVerified={() => {
          setShowPhoneVerificationModal(false);
          volunteerWitnessMutation.mutate();
        }} />
      )}
    </div>
  );
}