'use client';

import { useRouter } from 'next/navigation';
import { Gamepad2, Users, Eye, ChevronRight, Target, Share2 } from 'lucide-react';
import { Challenge } from '@/types/challenge';
import { toast } from 'sonner';

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const router = useRouter();

  const statusConfig: Record<string, { color: string; bg: string }> = {
    OPEN: { color: '#00FFB2', bg: 'rgba(0,255,178,0.12)' },
    PENDING_ACCEPTANCE: { color: '#FBCB4A', bg: 'rgba(251,203,74,0.15)' },
    ACCEPTED: { color: '#7C8CFF', bg: 'rgba(124,140,255,0.15)' },
    IN_PROGRESS: { color: '#7C8CFF', bg: 'rgba(124,140,255,0.15)' },
    LIVE: { color: '#FF6B6B', bg: 'rgba(255,107,107,0.15)' },
    COMPLETED: { color: '#FF61D6', bg: 'rgba(255,97,214,0.15)' },
    SETTLED: { color: '#00FFB2', bg: 'rgba(0,255,178,0.12)' },
    REJECTED: { color: '#F87171', bg: 'rgba(248,113,113,0.15)' },
    CANCELLED: { color: '#F87171', bg: 'rgba(248,113,113,0.15)' },
    DISPUTED: { color: '#F97316', bg: 'rgba(249,115,22,0.2)' },
    FLAGGED: { color: '#F97316', bg: 'rgba(249,115,22,0.2)' },
  };

  const sc = statusConfig[challenge.status] || { color: '#9CA3AF', bg: 'rgba(255,255,255,0.08)' };
  const creator = challenge.creator?.displayName || 'Unknown';
  const opponent = challenge.acceptor?.displayName || 'Open Slot';
  const witness = challenge.witness?.displayName;

  // const handleShare = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   const shareUrl = `${window.location.origin}/watch/${challenge._id}`;
  //   navigator.clipboard.writeText(shareUrl);
  //   toast.success('Share link copied to clipboard!');
  // };

  return (
    <div className="relative w-full rounded-3xl border border-white/5 bg-[#080C14] p-5 transition-all hover:border-[#00FFB2]/40 hover:bg-[#0F1523] group cursor-pointer">
      <button
        onClick={() => router.push(`/challenges/${challenge._id}`)}
        className="w-full text-left "
      >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Gamepad2 className="h-5 w-5 text-white/80" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold truncate text-white">{challenge.gameName.replace(/_/g, ' ')}</p>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ background: sc.bg, color: sc.color }}>
              {challenge.status.replace(/_/g, ' ')}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold text-white/70 bg-white/5">
              {challenge.challengeType || 'Direct'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span className="truncate">{creator} vs {opponent}</span>
            </span>
            {witness && (
              <span className="flex items-center gap-1 text-white/50">
                <Eye className="h-3.5 w-3.5" />
                <span className="truncate">{witness}</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-white/50">
              <Target className="h-3.5 w-3.5" />
              {challenge.platform}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
          <p className="text-lg font-semibold text-[#00FFB2]">₦{challenge.stakeAmount.toLocaleString()}</p>
          <span className="text-[11px] text-white/50">Total pot ₦{challenge.totalPot?.toLocaleString?.() || (challenge.stakeAmount * 2).toLocaleString()}</span>
          <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
        </div>
      </div>
      </button>
    </div>
  );
}
