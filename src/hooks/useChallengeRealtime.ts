import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket, connectSocket } from '@/lib/socket';
import { toast } from 'sonner';

interface UseChallengeRealtimeProps {
  challengeId: string;
  enabled?: boolean;
}

export function useChallengeRealtime({ challengeId, enabled = true }: UseChallengeRealtimeProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !challengeId) return;

    // Connect socket with auth token
    const token = localStorage.getItem('token');
    if (token) {
      connectSocket(token);
    }

    const socket = getSocket();

    // Join the challenge room (raw challengeId - matches what backend controller emits to)
    const joinRoom = () => {
      socket.emit('joinChallengeRoom', { challengeId });
      console.log('[Socket] Joined challenge room:', challengeId);
    };

    // If already connected, join immediately. Otherwise, join on connect.
    if (socket.connected) {
      joinRoom();
    } else {
      socket.on('connect', joinRoom);
    }

    // 1. Witness Volunteered
    const handleWitnessVolunteered = (data: any) => {
      console.log('[Socket] Witness volunteered:', data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      
      // Show toast
      toast.success('Witness Assigned', {
        description: `${data.witness.displayName} volunteered as witness!`
      });
    };

    // 2. Challenge Accepted
    const handleChallengeAccepted = (data: any) => {
      console.log('[Socket] Challenge accepted:', data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge-history'] });
      
      // Show toast
      toast.success('Challenge Accepted!', {
        description: `${data.acceptor.displayName} accepted the challenge!`
      });
    };

    // 3. Score Submitted
    const handleScoreSubmitted = (data: any) => {
      console.log('[Socket] Score submitted:', data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      
      // Show toast
      const scoreText = `${data.finalScore.creator}-${data.finalScore.acceptor}`;
      toast.info('Score Submitted', {
        description: `Match result: ${scoreText}`
      });
    };

    // 4. Challenge Completed
    const handleChallengeCompleted = (data: any) => {
      console.log('[Socket] Challenge completed:', data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge-history'] });
      
      // Show toast
      const scoreText = `${data.finalScore.creator}-${data.finalScore.acceptor}`;
      toast.success('Match Completed!', {
        description: `Final score: ${scoreText}. You have 10 minutes to dispute if needed.`
      });
    };

    // 5. Challenge Disputed
    const handleChallengeDisputed = (data: any) => {
      console.log('[Socket] Challenge disputed:', data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      
      // Show toast
      toast.warning('Match Disputed', {
        description: 'This match has been disputed and is under admin review.'
      });
    };

    // 6. Challenge Cancelled
    const handleChallengeCancelled = (data: any) => {
      console.log('[Socket] Challenge cancelled:', data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge-history'] });
      
      // Show toast
      toast.info('Challenge Cancelled', {
        description: 'This challenge has been cancelled.'
      });
    };

    // 7. Challenge Rejected
    const handleChallengeRejected = (data: any) => {
      console.log('[Socket] Challenge rejected:', data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge-history'] });
      
      // Show toast
      toast.info('Challenge Rejected', {
        description: 'This challenge has been rejected.'
      });
    };

    // 8. Room Code Shared (no toast - PrivateChatRoom handles its own toast)
    const handleRoomCodeShared = (data: any) => {
      console.log('[Socket] Room code shared:', data);
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
    };

    // 9. Player Joined Room
    const handlePlayerJoinedRoom = (data: any) => {
      console.log('[Socket] Player joined room:', data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      
      // Show toast
      const role = data.playerRole === 'creator' ? 'Creator' : 'Acceptor';
      if (data.bothJoined) {
        toast.success('Both Players Ready!', {
          description: 'Both players have joined the room. Match can start!'
        });
      } else {
        toast.info(`${role} Joined Room`, {
          description: 'Confirmed they are in the game room.'
        });
      }
    };

    // Register all event listeners
    socket.on('witnessVolunteered', handleWitnessVolunteered);
    socket.on('challengeAccepted', handleChallengeAccepted);
    socket.on('scoreSubmitted', handleScoreSubmitted);
    socket.on('challengeCompleted', handleChallengeCompleted);
    socket.on('challengeDisputed', handleChallengeDisputed);
    socket.on('challengeCancelled', handleChallengeCancelled);
    socket.on('challengeRejected', handleChallengeRejected);
    socket.on('roomCodeShared', handleRoomCodeShared);
    socket.on('playerJoinedRoom', handlePlayerJoinedRoom);

    // Cleanup function
    return () => {
      socket.off('connect', joinRoom);
      socket.off('witnessVolunteered', handleWitnessVolunteered);
      socket.off('challengeAccepted', handleChallengeAccepted);
      socket.off('scoreSubmitted', handleScoreSubmitted);
      socket.off('challengeCompleted', handleChallengeCompleted);
      socket.off('challengeDisputed', handleChallengeDisputed);
      socket.off('challengeCancelled', handleChallengeCancelled);
      socket.off('challengeRejected', handleChallengeRejected);
      socket.off('roomCodeShared', handleRoomCodeShared);
      socket.off('playerJoinedRoom', handlePlayerJoinedRoom);
      
      // Leave challenge room
      socket.emit('leaveChallengeRoom', { challengeId });
    };
  }, [challengeId, enabled, queryClient]);
}
