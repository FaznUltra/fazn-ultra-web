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
    <div className="flex flex-col h-full bg-white rounded-lg border">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-sm">Community Chat</h3>
          </div>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
            {spectatorCount} watching
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No messages yet. Be the first to chat!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className="flex items-start justify-between gap-2 p-2 rounded hover:bg-gray-50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs">
                  <span className="font-semibold text-gray-700">{msg.username}:</span>{' '}
                  <span className="text-gray-600 break-words">{msg.message}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
              
              {canModerate && !msg.isDeleted && (
                <button
                  onClick={() => deleteMessage(idx)}
                  className="shrink-0 h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-4 py-3 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
            placeholder="Chat with spectators..."
            maxLength={500}
            className="flex-1 h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            className="px-4 h-10 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {newMessage.length}/500 characters
        </p>
      </div>
    </div>
  );
}
