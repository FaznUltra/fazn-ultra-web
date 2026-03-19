'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { spectatingService } from '@/services/spectating.service';
import { Loader2, Eye, Users, TrendingUp } from 'lucide-react';
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
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval);
  }, [page]);

  const fetchLiveMatches = async () => {
    try {
      const response = await spectatingService.getPublicLiveMatches({ 
        limit: 20, 
        page 
      });
      setLiveMatches(response.data.challenges || []);
      setTotalPages(response.data.pagination?.pages || 1);
      setLoading(false);
    } catch (error: any) {
      console.error('Failed to load live matches:', error);
      toast.error('Failed to load live matches');
      setLoading(false);
    }
  };

  const formatGameName = (name: string) => {
    return name.replace(/_/g, ' ');
  };

  const getMatchDuration = (startTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(startTime).getTime();
    const minutes = Math.floor(diff / 60000);
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-20">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FEF2F2' }}>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          </div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--ultra-text)' }}>Live Matches</h1>
        </div>
        <p className="text-xs" style={{ color: 'var(--ultra-text-muted)' }}>
          Watch ongoing matches and join the community
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white rounded-xl p-3" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
          <div className="flex items-center gap-1 mb-0.5">
            <Eye className="w-3 h-3" style={{ color: 'var(--ultra-primary)' }} />
            <p className="text-[10px] font-medium" style={{ color: 'var(--ultra-text-muted)' }}>Live Now</p>
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--ultra-text)' }}>{liveMatches.length}</p>
        </div>

        <div className="bg-white rounded-xl p-3" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
          <div className="flex items-center gap-1 mb-0.5">
            <Users className="w-3 h-3" style={{ color: 'var(--ultra-primary)' }} />
            <p className="text-[10px] font-medium" style={{ color: 'var(--ultra-text-muted)' }}>Viewers</p>
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--ultra-text)' }}>
            {liveMatches.reduce((sum, match) => sum + match.spectating.spectatorCount, 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-3" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
          <div className="flex items-center gap-1 mb-0.5">
            <TrendingUp className="w-3 h-3" style={{ color: '#059669' }} />
            <p className="text-[10px] font-medium" style={{ color: 'var(--ultra-text-muted)' }}>Stakes</p>
          </div>
          <p className="text-lg font-bold" style={{ color: '#059669' }}>
            ₦{liveMatches.reduce((sum, match) => sum + match.totalPot, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Matches */}
      {liveMatches.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--ultra-primary-light)' }}>
            <Eye className="h-5 w-5" style={{ color: 'var(--ultra-primary)' }} />
          </div>
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--ultra-text)' }}>No Live Matches</p>
          <p className="text-xs" style={{ color: 'var(--ultra-text-muted)' }}>Check back soon for exciting matches!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {liveMatches.map((match) => (
            <div 
              key={match._id} 
              className="bg-white rounded-2xl overflow-hidden transition-all"
              style={{ boxShadow: 'var(--ultra-card-shadow)' }}
            >
              {/* Card Header */}
              <div className="px-4 py-2 flex items-center justify-between" style={{ background: 'var(--ultra-primary)' }}>
                <span className="text-[11px] font-semibold text-white">
                  {formatGameName(match.gameName)}
                </span>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-[10px] text-white font-bold">LIVE</span>
                </div>
              </div>

              {/* Players */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center flex-1">
                    <div className="w-10 h-10 rounded-xl mx-auto mb-1.5 flex items-center justify-center" style={{ background: 'var(--ultra-primary-light)' }}>
                      {match.creator.profileImage ? (
                        <img 
                          src={match.creator.profileImage} 
                          alt={match.creator.displayName}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold" style={{ color: 'var(--ultra-primary)' }}>
                          {match.creator.displayName[0]}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-xs truncate" style={{ color: 'var(--ultra-text)' }}>
                      {match.creator.displayName}
                    </p>
                    <span className="text-[10px]" style={{ color: 'var(--ultra-text-muted)' }}>Creator</span>
                  </div>

                  <div className="px-3">
                    <span className="text-sm font-bold" style={{ color: 'var(--ultra-text-muted)' }}>VS</span>
                  </div>

                  <div className="text-center flex-1">
                    <div className="w-10 h-10 rounded-xl mx-auto mb-1.5 flex items-center justify-center" style={{ background: '#FEF2F2' }}>
                      {match.acceptor.profileImage ? (
                        <img 
                          src={match.acceptor.profileImage} 
                          alt={match.acceptor.displayName}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold" style={{ color: '#DC2626' }}>
                          {match.acceptor.displayName[0]}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-xs truncate" style={{ color: 'var(--ultra-text)' }}>
                      {match.acceptor.displayName}
                    </p>
                    <span className="text-[10px]" style={{ color: 'var(--ultra-text-muted)' }}>Opponent</span>
                  </div>
                </div>

                {/* Match Info */}
                <div className="rounded-xl p-2.5 space-y-1.5 mb-3" style={{ background: 'var(--ultra-bg)' }}>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--ultra-text-secondary)' }}>Total Pot</span>
                    <span className="font-bold" style={{ color: '#059669' }}>₦{match.totalPot.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--ultra-text-secondary)' }}>Watching</span>
                    <span className="font-semibold" style={{ color: 'var(--ultra-text)' }}>{match.spectating.spectatorCount} spectators</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--ultra-text-secondary)' }}>Duration</span>
                    <span className="font-semibold" style={{ color: 'var(--ultra-text)' }}>{getMatchDuration(match.matchStartedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--ultra-text-secondary)' }}>Witness</span>
                    <span className="font-semibold text-xs truncate max-w-[120px]" style={{ color: 'var(--ultra-text)' }}>{match.witness.displayName}</span>
                  </div>
                </div>

                {/* Watch Button */}
                <button
                  onClick={() => router.push(`/challenges/${match._id}`)}
                  className="w-full py-2.5 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                  style={{ background: 'var(--ultra-primary)' }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Watch Match
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors"
            style={{ background: 'var(--ultra-primary-light)', color: 'var(--ultra-primary)' }}
          >
            Previous
          </button>
          <span className="text-xs" style={{ color: 'var(--ultra-text-muted)' }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors"
            style={{ background: 'var(--ultra-primary-light)', color: 'var(--ultra-primary)' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
