'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { spectatingService } from '@/services/spectating.service';
import { Eye, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface LiveMatch {
  _id: string;
  gameName: string;
  gameType: string;
  platform: string;
  creatorUsername: string;
  acceptorUsername: string;
  totalPot: number;
  matchStartedAt: Date;
  spectating: {
    spectatorCount: number;
  };
  creator: {
    displayName: string;
    profileImage: string | null;
    isVerified: boolean;
  };
  acceptor: {
    displayName: string;
    profileImage: string | null;
    isVerified: boolean;
  };
  witness: {
    displayName: string;
  };
}

export default function SpectatePage() {
  const router = useRouter();
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval);
  }, [page]);

  const fetchLiveMatches = async () => {
    try {
      const response = await spectatingService.getPublicLiveMatches({ limit: 20, page });
      setLiveMatches(response.data.challenges || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error: any) {
      toast.error('Failed to load live matches');
    } finally {
      setLoading(false);
    }
  };

  const formatGameName = (name: string) => name.replace(/_/g, ' ');

  const getMatchDuration = (startTime: Date) => {
    const diff = new Date().getTime() - new Date(startTime).getTime();
    const mins = Math.floor(diff / 60000);
    return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const totalViewers = liveMatches.reduce((s, m) => s + m.spectating.spectatorCount, 0);
  const totalPot = liveMatches.reduce((s, m) => s + m.totalPot, 0);

  // ── Avatar helper ──────────────────────────────────────────────────────────
  const Avatar = ({
    src,
    name,
    accent,
  }: {
    src: string | null;
    name: string;
    accent: string;
  }) => (
    <div
      className="w-11 h-11 rounded-xl mx-auto flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{ background: accent }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-black text-white/80">{name[0]?.toUpperCase()}</span>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03060b] flex items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10"
          style={{ borderTopColor: '#00FFB2' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03060b] text-white pb-24 lg:pb-6">
      <div className="max-w-2xl mx-auto p-4 lg:p-0 space-y-5">

        {/* ── Hero header ── */}
        <div className="rounded-3xl border border-white/[0.05] bg-gradient-to-br from-[#131A31] via-[#0B0F1B] to-[#05070C] p-5">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#FF6B6B] mb-1">Live Now</p>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-pulse" />
            <h1 className="text-2xl font-black">Spectate</h1>
          </div>
          <p className="text-xs text-white/40 mb-5">Watch ongoing matches and follow the action in real time.</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: Eye,        label: 'Live',    value: liveMatches.length,                          color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)' },
              { icon: Users,      label: 'Viewers', value: totalViewers,                                color: '#7C8CFF', bg: 'rgba(124,140,255,0.10)' },
              { icon: TrendingUp, label: 'Stakes',  value: `₦${totalPot.toLocaleString()}`,             color: '#00FFB2', bg: 'rgba(0,255,178,0.10)'   },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="rounded-2xl border border-white/[0.05] p-3" style={{ background: bg }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="h-3 w-3" style={{ color }} />
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: `${color}99` }}>{label}</p>
                </div>
                <p className="text-base font-black" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Empty state ── */}
        {liveMatches.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <div
              className="mx-auto h-14 w-14 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(255,107,107,0.08)' }}
            >
              <Eye className="h-5 w-5 text-[#FF6B6B]" />
            </div>
            <p className="text-sm font-bold text-white/40">No live matches right now</p>
            <p className="text-xs text-white/20">Check back soon — the arena heats up fast.</p>
          </div>
        )}

        {/* ── Match cards ── */}
        {liveMatches.length > 0 && (
          <div className="space-y-3">
            {liveMatches.map((match) => (
              <div
                key={match._id}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden"
              >
                {/* Card top stripe */}
                <div className="h-0.5 w-full bg-gradient-to-r from-[#FF6B6B]/60 via-[#FBCB4A]/40 to-transparent" />

                {/* Game label + live badge */}
                <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                    {formatGameName(match.gameName)}
                  </p>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,107,107,0.15)' }}>
                    <div className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-[#FF6B6B]">LIVE</span>
                  </div>
                </div>

                {/* Players */}
                <div className="flex items-center justify-between px-4 pb-4 gap-3">
                  {/* Creator */}
                  <div className="flex-1 text-center space-y-1.5">
                    <Avatar src={match.creator.profileImage} name={match.creator.displayName} accent="rgba(0,255,178,0.18)" />
                    <p className="text-xs font-bold truncate text-white">{match.creator.displayName}</p>
                    <p className="text-[10px] text-white/30">Creator</p>
                  </div>

                  {/* VS divider */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <span className="text-xs font-black text-white/20">VS</span>
                    <div className="h-px w-8 bg-white/10" />
                    <span className="text-[10px] text-white/20">{getMatchDuration(match.matchStartedAt)}</span>
                  </div>

                  {/* Acceptor */}
                  <div className="flex-1 text-center space-y-1.5">
                    <Avatar src={match.acceptor.profileImage} name={match.acceptor.displayName} accent="rgba(251,203,74,0.18)" />
                    <p className="text-xs font-bold truncate text-white">{match.acceptor.displayName}</p>
                    <p className="text-[10px] text-white/30">Opponent</p>
                  </div>
                </div>

                {/* Match meta */}
                <div className="mx-4 mb-4 rounded-xl border border-white/[0.05] bg-white/[0.03] p-3 space-y-2">
                  {[
                    { label: 'Total Pot',   value: `₦${match.totalPot.toLocaleString()}`,           color: '#00FFB2' },
                    { label: 'Watching',    value: `${match.spectating.spectatorCount} spectators`, color: null },
                    { label: 'Witness',     value: match.witness.displayName,                        color: null },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[11px] text-white/30">{label}</span>
                      <span
                        className="text-[11px] font-bold truncate max-w-[160px]"
                        style={{ color: color ?? 'rgba(255,255,255,0.7)' }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Watch CTA */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => router.push(`/challenges/${match._id}`)}
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: '#FF6B6B', color: '#fff' }}
                  >
                    <Eye className="w-4 h-4" />
                    Watch Match
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-white/[0.08] text-white/50 disabled:opacity-30 hover:bg-white/[0.05] transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <span className="text-xs text-white/30 tabular-nums">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-white/[0.08] text-white/50 disabled:opacity-30 hover:bg-white/[0.05] transition-all"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}