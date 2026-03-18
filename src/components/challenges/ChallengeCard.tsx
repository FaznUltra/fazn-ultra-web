'use client';

import { useRouter } from 'next/navigation';
import { Trophy, Users, Eye } from 'lucide-react';
import { Challenge } from '@/types/challenge';

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'PENDING_ACCEPTANCE':
        return 'text-green-600 bg-green-50';
      case 'ACCEPTED':
        return 'text-blue-600 bg-blue-50';
      case 'COMPLETED':
        return 'text-purple-600 bg-purple-50';
      case 'SETTLED':
        return 'text-green-600 bg-green-50';
      case 'REJECTED':
      case 'CANCELLED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <button
      onClick={() => router.push(`/challenges/${challenge._id}`)}
      className="w-full bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left"
    >
      {/* Header: Game + Status */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
              {challenge.gameName.replace(/_/g, ' ')}
            </p>
            <p className="text-xs text-gray-500">{challenge.platform}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(challenge.status)}`}>
          {getStatusText(challenge.status)}
        </span>
      </div>

      {/* Players + Stake */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Players Info */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600 truncate">
              {challenge.creator?.displayName || 'Unknown'} vs {challenge.acceptor?.displayName || 'Open'}
            </span>
          </div>
          {challenge.witness && (
            <div className="flex items-center gap-1 min-w-0">
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-600 truncate">{challenge.witness.displayName}</span>
            </div>
          )}
        </div>
        
        {/* Stake Amount */}
        <div className="text-left sm:text-right flex-shrink-0">
          <p className="text-base sm:text-lg font-bold text-blue-600">₦{challenge.stakeAmount.toLocaleString()}</p>
        </div>
      </div>
    </button>
  );
}
