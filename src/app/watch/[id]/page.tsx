'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Eye, MessageCircle, Share2, Heart, ThumbsUp, Flame, 
  Laugh, Angry, Hand, Send, Copy, X as XIcon, 
  Facebook, MessageSquare, ExternalLink, Trophy, Clock,
  Users, DollarSign, Verified
} from 'lucide-react';
import { spectateService, PublicChallenge, SpectatorComment } from '@/services/spectate.service';
import { useAuth } from '@/hooks/useAuth';
import { getSocket, connectSocket } from '@/lib/socket';
import { StreamEmbed } from '@/components/StreamEmbed';

const REACTION_EMOJIS = {
  LIKE: { emoji: '👍', icon: ThumbsUp, color: '#7C8CFF' },
  LOVE: { emoji: '❤️', icon: Heart, color: '#FF6B9D' },
  FIRE: { emoji: '🔥', icon: Flame, color: '#FF6B35' },
  LAUGH: { emoji: '😂', icon: Laugh, color: '#FFD93D' },
  WOW: { emoji: '😮', icon: Angry, color: '#6BCF7F' },
  CLAP: { emoji: '👏', icon: Hand, color: '#00FFB2' }
};

export default function SpectateChallengePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<PublicChallenge | null>(null);
  const [comments, setComments] = useState<SpectatorComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get unique participants from comments for @ mentions
  const participants = Array.from(
    new Set(
      comments.map(comment => comment.username)
    )
  ).filter(name => name !== user?.displayName);

  const challengeId = params.id as string;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/watch/${challengeId}` : '';

  // Fetch challenge and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [challengeRes, commentsRes] = await Promise.all([
          spectateService.getPublicChallenge(challengeId),
          spectateService.getComments(challengeId)
        ]);

        setChallenge(challengeRes.data.challenge);
        setComments(commentsRes.data.comments);

        // Join as spectator if authenticated
        if (user) {
          await spectateService.joinAsSpectator(challengeId);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || 'Failed to load challenge');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [challengeId, user]);

  // Socket.IO for real-time comments
  useEffect(() => {
    if (!challengeId) return;

    const token = localStorage.getItem('token');
    // Connect socket for all users (with or without token)
    if (token) {
      connectSocket(token);
    } else {
      // Connect without auth for public spectating
      const socket = getSocket();
      if (!socket.connected) {
        socket.connect();
      }
    }

    const socket = getSocket();

    // Join spectate room
    socket.emit('joinSpectateRoom', { challengeId });

    // Listen for new comments
    socket.on('spectatorCommentAdded', (comment: SpectatorComment) => {
      setComments((prev) => [...prev, comment]);
    });

    // Listen for reaction updates
    socket.on('reactionUpdate', ({ commentId, reaction }: any) => {
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, reactionCounts: reaction.reactionCounts, reactions: reaction.reactions }
            : c
        )
      );
    });

    return () => {
      socket.emit('leaveSpectateRoom', { challengeId });
      socket.off('spectatorCommentAdded');
      socket.off('reactionUpdate');
    };
  }, [challengeId]);

  // Auto-scroll comments
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handlePostComment = async () => {
    if (!user) {
      // Save return URL before redirecting
      if (typeof window !== 'undefined') {
        localStorage.setItem('returnUrl', window.location.pathname);
      }
      router.push('/sign-in');
      return;
    }

    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await spectateService.postComment(challengeId, newComment);
      
      // Emit to socket for real-time broadcast
      const socket = getSocket();
      socket.emit('newSpectatorComment', {
        challengeId,
        comment: response.data.comment
      });

      setNewComment('');
    } catch (error: any) {
      console.error('Error posting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReaction = async (commentId: string, reactionType: keyof typeof REACTION_EMOJIS) => {
    if (!user) {
      // Save return URL before redirecting
      if (typeof window !== 'undefined') {
        localStorage.setItem('returnUrl', window.location.pathname);
      }
      router.push('/sign-in');
      return;
    }

    try {
      const response = await spectateService.addReaction(commentId, reactionType);
      
      // Emit to socket for real-time broadcast
      const socket = getSocket();
      socket.emit('spectatorReactionAdded', {
        challengeId,
        commentId,
        reaction: response.data.comment
      });

      // Update local state
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? response.data.comment : c
        )
      );
    } catch (error: any) {
      console.error('Error adding reaction:', error);
      toast.error(error.response?.data?.message || 'Failed to add reaction');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for @ mentions
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      // Check if there's a space after @, if so, close mentions
      if (textAfterAt.includes(' ')) {
        setShowMentions(false);
      } else {
        setMentionSearch(textAfterAt);
        setMentionPosition(lastAtIndex);
        setShowMentions(true);
        setSelectedMentionIndex(0);
      }
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (username: string) => {
    const beforeMention = newComment.slice(0, mentionPosition);
    const afterMention = newComment.slice(mentionPosition + mentionSearch.length + 1);
    const newText = `${beforeMention}@${username} ${afterMention}`;
    setNewComment(newText);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentions && filteredParticipants.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => 
          prev < filteredParticipants.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => 
          prev > 0 ? prev - 1 : filteredParticipants.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (showMentions) {
          handleMentionSelect(filteredParticipants[selectedMentionIndex]);
        } else {
          handlePostComment();
        }
        return;
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handlePostComment();
    }
  };

  const filteredParticipants = participants.filter(name =>
    name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp' | 'copy') => {
    const text = `🎮 Watch ${challenge?.creator.displayName} vs ${challenge?.acceptor?.displayName || 'TBA'} compete in ${challenge?.gameName} for $${challenge?.stakeAmount}! ${challenge?.hashtag || ''}`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        break;
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#05070b' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00FFB2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading match...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#05070b' }}>
        <div className="text-center">
          <p className="text-white/60 text-lg mb-4">Challenge not found</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl font-semibold"
            style={{ background: '#00FFB2', color: '#05070b' }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const panel = 'rounded-2xl border border-white/[0.06]';
  const statusColors: Record<string, string> = {
    LIVE: '#00FFB2',
    COMPLETED: '#7C8CFF',
    OPEN: '#FFD93D',
    ACCEPTED: '#6BCF7F'
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: '#05070b' }}>
      {/* Header */}
      <div className="border-b border-white/[0.06] sticky top-0 z-50" style={{ background: 'rgba(5,7,11,0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <XIcon className="w-5 h-5 text-white/60" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Live Match</h1>
                <p className="text-xs text-white/40">{challenge.hashtag}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <Eye className="w-4 h-4 text-white/60" />
                <span className="text-sm font-semibold text-white">{challenge.spectating.spectatorCount}</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2.5 rounded-xl transition-all"
                  style={{ background: 'rgba(0,255,178,0.1)', color: '#00FFB2' }}
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 p-2 rounded-xl border border-white/10 shadow-2xl" style={{ background: '#0F1523', minWidth: '200px' }}>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <XIcon className="w-4 h-4 text-white/60" />
                      <span className="text-sm text-white">Share on X</span>
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <Facebook className="w-4 h-4 text-white/60" />
                      <span className="text-sm text-white">Share on Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <MessageSquare className="w-4 h-4 text-white/60" />
                      <span className="text-sm text-white">Share on WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <Copy className="w-4 h-4 text-white/60" />
                      <span className="text-sm text-white">Copy Link</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <div
                className="px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
                style={{ background: `${statusColors[challenge.status]}20`, color: statusColors[challenge.status] }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: statusColors[challenge.status] }}></div>
                {challenge.status}
              </div>
              {challenge.status === 'LIVE' && (
                <span className="text-xs text-white/40">Started {new Date(challenge.matchStartedAt!).toLocaleTimeString()}</span>
              )}
            </div>

            {/* Streams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Creator Stream */}
              <div className={`${panel} p-4`} style={{ background: 'rgba(124,140,255,0.05)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={challenge.creator.profileImage || '/default-avatar.png'}
                    alt={challenge.creator.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{challenge.creator.displayName}</p>
                      {challenge.creator.isVerified && <Verified className="w-4 h-4 text-[#00FFB2]" />}
                    </div>
                    <p className="text-xs text-white/40">Creator</p>
                  </div>
                </div>

                {challenge.creatorStreamingLink?.url ? (
                  <div className="space-y-2">
                    <StreamEmbed
                      platform={challenge.creatorStreamingLink.platform!}
                      url={challenge.creatorStreamingLink.url}
                      playerName={challenge.creator.displayName}
                    />
                    <a
                      href={challenge.creatorStreamingLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-lg font-semibold text-xs transition-all hover:opacity-80"
                      style={{ background: 'rgba(124,140,255,0.2)', color: '#7C8CFF' }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open in {challenge.creatorStreamingLink.platform === 'YOUTUBE' ? 'YouTube' : 'Twitch'}
                    </a>
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-xl bg-white/5 flex items-center justify-center">
                    <p className="text-white/40 text-sm">Stream not available</p>
                  </div>
                )}
              </div>

              {/* Acceptor Stream */}
              {challenge.acceptor && (
                <div className={`${panel} p-4`} style={{ background: 'rgba(255,107,157,0.05)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={challenge.acceptor.profileImage || '/default-avatar.png'}
                      alt={challenge.acceptor.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{challenge.acceptor.displayName}</p>
                        {challenge.acceptor.isVerified && <Verified className="w-4 h-4 text-[#00FFB2]" />}
                      </div>
                      <p className="text-xs text-white/40">Acceptor</p>
                    </div>
                  </div>

                  {challenge.acceptorStreamingLink?.url ? (
                    <div className="space-y-2">
                      <StreamEmbed
                        platform={challenge.acceptorStreamingLink.platform!}
                        url={challenge.acceptorStreamingLink.url}
                        playerName={challenge.acceptor.displayName}
                      />
                      <a
                        href={challenge.acceptorStreamingLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg font-semibold text-xs transition-all hover:opacity-80"
                        style={{ background: 'rgba(255,107,157,0.2)', color: '#FF6B9D' }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open in {challenge.acceptorStreamingLink.platform === 'YOUTUBE' ? 'YouTube' : 'Twitch'}
                      </a>
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-xl bg-white/5 flex items-center justify-center">
                      <p className="text-white/40 text-sm">Stream not available</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Match Info */}
            <div className={`${panel} p-5`} style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4">Match Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-white/40 mb-1">Game</p>
                  <p className="text-sm font-semibold text-white">{challenge.gameName.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Platform</p>
                  <p className="text-sm font-semibold text-white">{challenge.platform}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Stake</p>
                  <p className="text-sm font-semibold text-[#00FFB2]">${challenge.stakeAmount}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Winner Gets</p>
                  <p className="text-sm font-semibold text-[#FFD93D]">${challenge.winnerPayout.toFixed(2)}</p>
                </div>
              </div>

              {challenge.winner && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-[#FFD93D]" />
                    <div>
                      <p className="text-xs text-white/40">Winner</p>
                      <p className="text-sm font-semibold text-white">{challenge.winner.displayName}</p>
                    </div>
                    {challenge.finalScore && (
                      <div className="ml-auto text-right">
                        <p className="text-xs text-white/40">Final Score</p>
                        <p className="text-sm font-semibold text-white">
                          {challenge.finalScore.creator} - {challenge.finalScore.acceptor}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${panel} flex flex-col h-[calc(100vh-200px)] sticky top-24`} style={{ background: 'rgba(255,255,255,0.02)' }}>
              {/* Comments Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#00FFB2]" />
                    <h3 className="font-semibold text-white">Comments</h3>
                  </div>
                  <span className="text-xs text-white/40">{challenge.spectating.totalComments}</span>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40">No comments yet</p>
                    <p className="text-xs text-white/30 mt-1">Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-start gap-3 mb-2">
                        <img
                          src={comment.userProfileImage || '/default-avatar.png'}
                          alt={comment.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white/70">{comment.username}</p>
                          <p className="text-sm text-white/90 mt-1">{comment.comment}</p>
                        </div>
                      </div>

                      {/* Reactions */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {(Object.keys(REACTION_EMOJIS) as Array<keyof typeof REACTION_EMOJIS>).map((type) => {
                          const count = comment.reactionCounts[type];
                          const Icon = REACTION_EMOJIS[type].icon;
                          const hasReacted = comment.reactions.some(r => r.type === type && r.user === user?._id);

                          return (
                            <button
                              key={type}
                              onClick={() => handleReaction(comment._id, type)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                                hasReacted ? 'scale-110' : 'hover:scale-105'
                              }`}
                              style={{
                                background: hasReacted ? `${REACTION_EMOJIS[type].color}20` : 'rgba(255,255,255,0.05)',
                                color: hasReacted ? REACTION_EMOJIS[type].color : 'rgba(255,255,255,0.4)'
                              }}
                            >
                              <Icon className="w-3 h-3" />
                              {count > 0 && <span className="font-semibold">{count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
                <div ref={commentsEndRef} />
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-white/10">
                <div className="relative">
                  {/* Mention Dropdown */}
                  {showMentions && filteredParticipants.length > 0 && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 max-h-40 overflow-y-auto rounded-lg border border-white/10 shadow-2xl" style={{ background: '#0F1523' }}>
                      {filteredParticipants.map((participant, index) => (
                        <button
                          key={participant}
                          onClick={() => handleMentionSelect(participant)}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                            index === selectedMentionIndex ? 'bg-[#00FFB2]/20 text-[#00FFB2]' : 'text-white/70 hover:bg-white/5'
                          }`}
                        >
                          @{participant}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newComment}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a comment... (type @ to mention)"
                      disabled={commentLoading}
                      className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:border-[#00FFB2]/50 focus:outline-none focus:ring-1 focus:ring-[#00FFB2]/50 disabled:opacity-50"
                    />
                    <button
                      onClick={handlePostComment}
                      disabled={!newComment.trim() || commentLoading}
                      className="px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 transition-all"
                      style={{ background: '#00FFB2', color: '#05070b' }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
