'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { spectatingService } from '@/services/spectating.service';
import { Button } from '@/components/ui/button';
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
      setLiveMatches(response.data.matches);
      setTotalPages(response.data.pagination.pages);
      setLoading(false);
    } catch (error: any) {
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Live Matches</h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Watch ongoing matches and join the community chat
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-purple-600" />
            <p className="text-xs font-medium text-purple-700">Live Now</p>
          </div>
          <p className="text-2xl font-bold text-purple-900">{liveMatches.length}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-medium text-blue-700">Total Viewers</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {liveMatches.reduce((sum, match) => sum + match.spectating.spectatorCount, 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-xs font-medium text-green-700">Total Stakes</p>
          </div>
          <p className="text-2xl font-bold text-green-900">
            ₦{liveMatches.reduce((sum, match) => sum + match.totalPot, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Matches Grid */}
      {liveMatches.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No Live Matches</h3>
          <p className="text-sm text-gray-500">Check back soon for exciting matches!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveMatches.map((match) => (
            <div 
              key={match._id} 
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    {formatGameName(match.gameName)}
                  </span>
                  <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs text-white font-bold">LIVE</span>
                  </div>
                </div>
              </div>

              {/* Players */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                      {match.creator.profileImage ? (
                        <img 
                          src={match.creator.profileImage} 
                          alt={match.creator.displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-blue-600">
                          {match.creator.displayName[0]}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-sm truncate">
                      {match.creator.displayName}
                    </p>
                    <span className="text-xs text-gray-500">Creator</span>
                  </div>

                  <div className="px-4">
                    <span className="text-xl font-bold text-gray-400">VS</span>
                  </div>

                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                      {match.acceptor.profileImage ? (
                        <img 
                          src={match.acceptor.profileImage} 
                          alt={match.acceptor.displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-red-600">
                          {match.acceptor.displayName[0]}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-sm truncate">
                      {match.acceptor.displayName}
                    </p>
                    <span className="text-xs text-gray-500">Opponent</span>
                  </div>
                </div>

                {/* Match Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">💰 Total Pot</span>
                    <span className="font-bold text-green-600">
                      ₦{match.totalPot.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">👁️ Watching</span>
                    <span className="font-semibold">
                      {match.spectating.spectatorCount} spectators
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">⏱️ Duration</span>
                    <span className="font-semibold">
                      {getMatchDuration(match.matchStartedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">👨‍⚖️ Witness</span>
                    <span className="font-semibold text-xs truncate max-w-[120px]">
                      {match.witness.displayName}
                    </span>
                  </div>
                </div>

                {/* Watch Button */}
                <Button 
                  onClick={() => router.push(`/challenges/${match._id}`)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Watch Match
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
