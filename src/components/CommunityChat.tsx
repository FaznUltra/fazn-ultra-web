'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Send, Trash2, Users } from 'lucide-react';
import { spectatingService, SpectatingMessage } from '@/services/spectating.service';
import { useAuth } from '@/hooks/useAuth';

interface CommunityChatProps {
  challengeId: string;
  canModerate: boolean;
  spectatorCount: number;
}

export function CommunityChat({ 
  challengeId, 
  canModerate,
  spectatorCount 
}: CommunityChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<SpectatingMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await spectatingService.getCommunityChatMessages(challengeId, 50);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [challengeId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (newMessage.length > 500) {
      toast.error('Message too long (max 500 characters)');
      return;
    }

    setLoading(true);
    try {
      await spectatingService.sendCommunityChatMessage(challengeId, newMessage.trim());
      setNewMessage('');
      
      // Refresh messages
      const response = await spectatingService.getCommunityChatMessages(challengeId, 50);
      setMessages(response.data.messages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageIndex: number) => {
    try {
      await spectatingService.deleteCommunityChatMessage(challengeId, messageIndex);
      toast.success('Message deleted');
      
      // Refresh messages
      const response = await spectatingService.getCommunityChatMessages(challengeId, 50);
      setMessages(response.data.messages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete message');
    }
  };

  return (
    <div className="flex flex-col h-full rounded-3xl border border-white/5 bg-[#050b16]/80 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-[#2b1038] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#FF61D6]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-wide text-white">Community Chat</h3>
              <p className="text-[11px] text-white/60">Public hype room</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold bg-[#2b1038] text-[#FF61D6] border border-[#ff61d6]/30">
            {spectatorCount} watching
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-white/50 text-sm py-8">
            No messages yet. Be the first to chat!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className="flex items-start justify-between gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs">
                  <span className="font-semibold text-white">{msg.username}:</span>{' '}
                  <span className="text-white/70 break-words">{msg.message}</span>
                </p>
                <p className="text-[11px] text-white/40 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
              
              {canModerate && !msg.isDeleted && (
                <button
                  onClick={() => deleteMessage(idx)}
                  className="shrink-0 h-7 w-7 p-0 text-[#FF6B6B] hover:text-white hover:bg-[#ff6b6b]/20 rounded-full transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-5 py-4 border-t border-white/5 bg-white/5">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
            placeholder="Chat with spectators..."
            maxLength={500}
            className="flex-1 h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-white/40 focus:border-[#FF61D6] focus:ring-2 focus:ring-[#FF61D6]/40 focus:outline-none"
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            className="px-5 h-11 rounded-2xl font-semibold bg-gradient-to-r from-[#FF61D6] to-[#FF8A5B] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
        <p className="text-xs text-white/40 mt-2">
          {newMessage.length}/500 characters
        </p>
      </div>
    </div>
  );
}
