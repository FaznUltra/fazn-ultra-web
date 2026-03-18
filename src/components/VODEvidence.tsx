'use client';

import { ExternalLink, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StreamEvidence {
  platform: 'YOUTUBE' | 'TWITCH' | null;
  liveUrl: string | null;
  vodUrl: string | null;
  streamStartTime: Date | null;
  streamEndTime: Date | null;
  vodAvailable: boolean;
  vodCheckedAt: Date | null;
}

interface DisputeEvidence {
  submittedBy: string;
  vodUrl: string;
  description: string;
  submittedAt: Date;
}

interface VODEvidenceProps {
  creatorUsername: string;
  acceptorUsername: string;
  creatorStream?: StreamEvidence;
  acceptorStream?: StreamEvidence;
  disputeEvidence?: DisputeEvidence[];
}

export function VODEvidence({ 
  creatorUsername,
  acceptorUsername,
  creatorStream, 
  acceptorStream,
  disputeEvidence 
}: VODEvidenceProps) {
  if (!creatorStream && !acceptorStream) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Video className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold">Match Evidence (VODs)</h3>
      </div>

      {/* Creator VOD */}
      {creatorStream?.vodAvailable && creatorStream.vodUrl && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-semibold mb-2 text-sm">{creatorUsername}'s Stream</p>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full sm:w-auto"
          >
            <a 
              href={creatorStream.vodUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              Watch VOD
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Recorded: {creatorStream.streamStartTime && new Date(creatorStream.streamStartTime).toLocaleString()}
          </p>
        </div>
      )}

      {/* Acceptor VOD */}
      {acceptorStream?.vodAvailable && acceptorStream.vodUrl && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-semibold mb-2 text-sm">{acceptorUsername}'s Stream</p>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full sm:w-auto"
          >
            <a 
              href={acceptorStream.vodUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              Watch VOD
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Recorded: {acceptorStream.streamStartTime && new Date(acceptorStream.streamStartTime).toLocaleString()}
          </p>
        </div>
      )}

      {/* VOD Processing Message */}
      {(!creatorStream?.vodAvailable || !acceptorStream?.vodAvailable) && (
        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⏳ VOD recordings are being processed. They will be available within 30 minutes after the match.
          </p>
        </div>
      )}

      {/* Dispute Evidence */}
      {disputeEvidence && disputeEvidence.length > 0 && (
        <div className="border rounded-lg p-4 bg-red-50 border-red-200">
          <p className="font-semibold mb-3 text-sm text-red-900">Submitted Dispute Evidence</p>
          <div className="space-y-2">
            {disputeEvidence.map((evidence, idx) => (
              <div key={idx} className="bg-white p-3 rounded border">
                <Button
                  variant="link"
                  size="sm"
                  asChild
                  className="p-0 h-auto text-blue-600"
                >
                  <a 
                    href={evidence.vodUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Evidence {idx + 1}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
                <p className="text-sm text-gray-600 mt-1">{evidence.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted: {new Date(evidence.submittedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
