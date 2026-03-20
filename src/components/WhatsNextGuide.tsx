'use client';

import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  Key, 
  PlayCircle,
  Trophy,
  Flag,
  XCircle,
  Info
} from 'lucide-react';
import { ChallengeStatus } from '@/types/challenge';

interface WhatsNextGuideProps {
  status: ChallengeStatus;
  isCreator: boolean;
  isAcceptor: boolean;
  isWitness: boolean;
  hasWitness: boolean;
  hasRoomCode: boolean;
  creatorJoined: boolean;
  acceptorJoined: boolean;
  canVolunteerAsWitness: boolean;
  disputeDeadline?: string;
  userRole: 'creator' | 'acceptor' | 'witness' | 'spectator';
}

export function WhatsNextGuide({
  status,
  isCreator,
  isAcceptor,
  isWitness,
  hasWitness,
  hasRoomCode,
  creatorJoined,
  acceptorJoined,
  canVolunteerAsWitness,
  disputeDeadline,
  userRole
}: WhatsNextGuideProps) {

  const getGuidance = () => {
    // OPEN - Waiting for acceptance
    if (status === 'OPEN' || status === 'PENDING_ACCEPTANCE') {
      if (isCreator) {
        return {
          icon: Clock,
          iconColor: 'text-yellow-500',
          title: "Waiting for Opponent",
          description: "Your challenge is live and waiting for someone to accept it.",
          steps: [
            "Share your challenge link with friends",
            "Wait for an opponent to accept",
            "You can cancel anytime before acceptance"
          ],
          tip: "Challenges with higher stakes get accepted faster!"
        };
      }
      
      if (isAcceptor) {
        return {
          icon: AlertCircle,
          iconColor: 'text-blue-500',
          title: "Accept or Reject?",
          description: "You've been challenged! Review the details and make your decision.",
          steps: [
            "Check the stake amount and game details",
            "Ensure you're available at the match time",
            "Click 'Accept Challenge' to lock in your stake"
          ],
          tip: "Once accepted, your stake will be deducted from your wallet."
        };
      }

      return {
        icon: Users,
        iconColor: 'text-gray-500',
        title: "Challenge Pending",
        description: "This challenge is waiting for an opponent to accept.",
        steps: [
          "You can spectate once the match goes live",
          "Join the community chat to discuss"
        ],
        tip: null
      };
    }

    // ACCEPTED - Need witness
    if (status === 'ACCEPTED' && !hasWitness) {
      if (isCreator || isAcceptor) {
        return {
          icon: Users,
          iconColor: 'text-orange-500',
          title: "Waiting for Witness",
          description: "A witness is required to verify and start the match.",
          steps: [
            "Wait for a verified user to volunteer as witness",
            "The witness will verify both players are streaming",
            "Once witness joins, creator can share the room code"
          ],
          tip: "Witnesses must have verified phone numbers to ensure fairness."
        };
      }

      if (canVolunteerAsWitness) {
        return {
          icon: Flag,
          iconColor: 'text-green-500',
          title: "Volunteer as Witness",
          description: "You can witness this match and earn credibility!",
          steps: [
            "Click 'Volunteer as Witness' below",
            "You'll verify both players are streaming live",
            "Start the match when both players are ready",
            "Submit the final score after the match"
          ],
          tip: "Witnessing builds your reputation and unlocks higher-stake matches!"
        };
      }

      return {
        icon: Clock,
        iconColor: 'text-gray-500',
        title: "Waiting for Witness",
        description: "This match needs a witness to proceed.",
        steps: [
          "A verified user will volunteer as witness",
          "You can spectate once the match goes live"
        ],
        tip: null
      };
    }

    // ACCEPTED - Has witness, need room code
    if (status === 'ACCEPTED' && hasWitness && !hasRoomCode) {
      if (isCreator) {
        return {
          icon: Key,
          iconColor: 'text-purple-500',
          title: "Share Room Code",
          description: "Create a private match room and share the code.",
          steps: [
            "Open your game and create a private match",
            "Copy the room code from the game",
            "Click 'Share Room Code' below and paste it",
            "Both players will receive the code to join"
          ],
          tip: "Make sure to create the room with the correct game settings!"
        };
      }

      if (isAcceptor || isWitness) {
        return {
          icon: Clock,
          iconColor: 'text-yellow-500',
          title: "Waiting for Room Code",
          description: "The creator is setting up the game room.",
          steps: [
            "Wait for the creator to share the room code",
            "You'll receive a notification when it's ready",
            "Join the game room using the code"
          ],
          tip: "Make sure your game is updated and ready to join!"
        };
      }
    }

    // ACCEPTED - Has room code, waiting for players
    if (status === 'ACCEPTED' && hasRoomCode && (!creatorJoined || !acceptorJoined)) {
      if (isCreator && !creatorJoined) {
        return {
          icon: PlayCircle,
          iconColor: 'text-blue-500',
          title: "Join the Game Room",
          description: "Use the room code to join the private match.",
          steps: [
            "Open your game",
            "Go to 'Join Private Match'",
            "Enter the room code shown below",
            "Click 'Confirm Joined' once you're in the room"
          ],
          tip: "Make sure you're streaming before confirming!"
        };
      }

      if (isAcceptor && !acceptorJoined) {
        return {
          icon: PlayCircle,
          iconColor: 'text-blue-500',
          title: "Join the Game Room",
          description: "Use the room code to join the private match.",
          steps: [
            "Open your game",
            "Go to 'Join Private Match'",
            "Enter the room code shown below",
            "Click 'Confirm Joined' once you're in the room"
          ],
          tip: "Make sure you're streaming before confirming!"
        };
      }

      if (isWitness) {
        return {
          icon: Clock,
          iconColor: 'text-yellow-500',
          title: "Waiting for Players",
          description: "Both players need to join the game room.",
          steps: [
            creatorJoined ? "✅ Creator has joined" : "⏳ Waiting for creator to join",
            acceptorJoined ? "✅ Acceptor has joined" : "⏳ Waiting for acceptor to join",
            "Once both join, verify they're streaming",
            "Click 'Start Match' when ready"
          ],
          tip: "Ensure both players are live streaming before starting!"
        };
      }
    }

    // ACCEPTED - Both joined, ready to start
    if (status === 'ACCEPTED' && hasRoomCode && creatorJoined && acceptorJoined) {
      if (isWitness) {
        return {
          icon: PlayCircle,
          iconColor: 'text-green-500',
          title: "Start the Match",
          description: "Both players are ready. Verify streaming and start!",
          steps: [
            "Verify both players are streaming live",
            "Check that both are in the game room",
            "Click 'Start Match' to begin",
            "Monitor the match and submit scores when done"
          ],
          tip: "The system will auto-verify their streaming status!"
        };
      }

      if (isCreator || isAcceptor) {
        return {
          icon: Clock,
          iconColor: 'text-green-500',
          title: "Ready to Start",
          description: "Waiting for witness to start the match.",
          steps: [
            "Make sure you're streaming live",
            "Stay in the game room",
            "The witness will start the match shortly",
            "Play your best and good luck!"
          ],
          tip: "The match will start automatically once witness confirms."
        };
      }
    }

    // LIVE - Match in progress
    if (status === 'LIVE') {
      if (isCreator || isAcceptor) {
        return {
          icon: Trophy,
          iconColor: 'text-red-500',
          title: "Match is Live!",
          description: "The match is in progress. Play your best!",
          steps: [
            "Keep streaming throughout the match",
            "Play fairly and follow the rules",
            "The witness will submit scores when done",
            "You can flag suspicious activity if needed"
          ],
          tip: "Your stream is being recorded as evidence!"
        };
      }

      if (isWitness) {
        return {
          icon: Flag,
          iconColor: 'text-red-500',
          title: "Monitor the Match",
          description: "Watch both streams and verify the final scores.",
          steps: [
            "Monitor both player streams",
            "Watch for any suspicious activity",
            "Note the final scores accurately",
            "Click 'Complete Match' and submit scores when done"
          ],
          tip: "You can flag the match if you see cheating or issues."
        };
      }

      return {
        icon: Trophy,
        iconColor: 'text-red-500',
        title: "Match in Progress",
        description: "Watch the live streams and enjoy the match!",
        steps: [
          "Watch both player streams below",
          "Chat with other spectators",
          "See the final result when match completes"
        ],
        tip: null
      };
    }

    // COMPLETED - Dispute window
    if (status === 'COMPLETED' && disputeDeadline) {
      const timeLeft = new Date(disputeDeadline).getTime() - Date.now();
      const canDispute = timeLeft > 0;

      if ((isCreator || isAcceptor) && canDispute) {
        return {
          icon: AlertCircle,
          iconColor: 'text-yellow-500',
          title: "Match Completed - Review Period",
          description: "You have 10 minutes to dispute if you disagree with the result.",
          steps: [
            "Review the final scores and match result",
            "Watch the stream recordings if available",
            "Click 'Dispute Result' if you believe there's an error",
            "If no dispute, match will auto-settle and winner gets paid"
          ],
          tip: "Only dispute if you have valid evidence. False disputes hurt your reputation."
        };
      }

      if (isWitness) {
        return {
          icon: Clock,
          iconColor: 'text-green-500',
          title: "Match Completed",
          description: "Waiting for dispute window to close.",
          steps: [
            "Players have 10 minutes to dispute",
            "If no dispute, match will auto-settle",
            "Your witnessing is complete!"
          ],
          tip: "Thank you for witnessing this match!"
        };
      }
    }

    // DISPUTED
    if (status === 'DISPUTED') {
      return {
        icon: Flag,
        iconColor: 'text-red-500',
        title: "Under Review",
        description: "This match has been disputed and is under admin review.",
        steps: [
          "Admin team is reviewing the evidence",
          "Stream recordings are being analyzed",
          "You'll be notified of the final decision",
          "Stakes are locked until resolution"
        ],
        tip: "Reviews typically complete within 24-48 hours."
      };
    }

    // SETTLED
    if (status === 'SETTLED') {
      return {
        icon: CheckCircle,
        iconColor: 'text-green-500',
        title: "Match Settled",
        description: "This match is complete and winnings have been distributed.",
        steps: [
          "Final result has been confirmed",
          "Winner has received their payout",
          "Match is now closed"
        ],
        tip: null
      };
    }

    // CANCELLED
    if (status === 'CANCELLED') {
      return {
        icon: XCircle,
        iconColor: 'text-gray-500',
        title: "Challenge Cancelled",
        description: "This challenge was cancelled before completion.",
        steps: [
          "Stakes have been refunded",
          "No further action needed"
        ],
        tip: null
      };
    }

    // REJECTED
    if (status === 'REJECTED') {
      return {
        icon: XCircle,
        iconColor: 'text-gray-500',
        title: "Challenge Rejected",
        description: "This challenge was rejected by the opponent.",
        steps: [
          "Stakes have been refunded",
          "You can create a new challenge"
        ],
        tip: null
      };
    }

    // Default fallback
    return {
      icon: Info,
      iconColor: 'text-gray-500',
      title: "Challenge Status",
      description: "Check back for updates on this challenge.",
      steps: [],
      tip: null
    };
  };

  const guidance = getGuidance();
  const Icon = guidance.icon;

  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-lg p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-full bg-background/50 ${guidance.iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{guidance.title}</h3>
          <p className="text-muted-foreground text-sm">{guidance.description}</p>
        </div>
      </div>

      {/* Steps */}
      {guidance.steps.length > 0 && (
        <div className="space-y-3 mb-4">
          <p className="text-sm font-semibold text-foreground/80">What to do next:</p>
          <ol className="space-y-2">
            {guidance.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-foreground/90 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Tip */}
      {guidance.tip && (
        <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
          <p className="text-xs text-green-400 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span><strong>Pro Tip:</strong> {guidance.tip}</span>
          </p>
        </div>
      )}
    </div>
  );
}
