'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Send, Lock, Copy } from 'lucide-react';
import { privateChatService, PrivateChatMessage } from '@/services/privateChat.service';
import { useAuth } from '@/hooks/useAuth';

interface PrivateChatRoomProps {
  challengeId: string;
  isCreator: boolean;
  isAcceptor: boolean;
  isWitness: boolean;
}

export function PrivateChatRoom({ 
  challengeId, 
  isCreator, 
  isAcceptor, 
  isWitness 
}: PrivateChatRoomProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<PrivateChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await privateChatService.getPrivateChatMessages(challengeId);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [challengeId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await privateChatService.sendPrivateChatMessage(challengeId, newMessage.trim());
      setNewMessage('');
      
      // Refresh messages
      const response = await privateChatService.getPrivateChatMessages(challengeId);
      setMessages(response.data.messages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const shareRoomCode = async () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    setLoading(true);
    try {
      await privateChatService.shareRoomCodeViaChat(challengeId, roomCode.trim());
      setRoomCode('');
      toast.success('Room code shared successfully');
      
      // Refresh messages
      const response = await privateChatService.getPrivateChatMessages(challengeId);
      setMessages(response.data.messages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to share room code');
    } finally {
      setLoading(false);
    }
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Room code copied to clipboard');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-sm">Private Chat</h3>
          <span className="text-xs text-gray-500">(Creator, Acceptor, Witness only)</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-lg ${
                msg.type === 'ROOM_CODE' 
                  ? 'bg-blue-50 border border-blue-200' 
                  : msg.type === 'SYSTEM'
                  ? 'bg-gray-50 border border-gray-200'
                  : msg.senderId === user?._id
                  ? 'bg-green-50 border border-green-200 ml-8'
                  : 'bg-gray-50 border border-gray-200 mr-8'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-gray-700 mb-1">
                    {msg.senderUsername}
                  </p>
                  <p className="text-sm break-words">{msg.message}</p>
                </div>
                
                {msg.type === 'ROOM_CODE' && (
                  <button
                    onClick={() => {
                      const code = msg.message.replace('Room Code: ', '');
                      copyRoomCode(code);
                    }}
                    className="shrink-0 p-1.5 hover:bg-blue-100 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 text-blue-600" />
                  </button>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Room Code Input (Creator Only) */}
      {isCreator && (
        <div className="px-4 py-3 border-t bg-blue-50">
          <label htmlFor="roomCode" className="text-xs font-semibold mb-2 block text-blue-900">
            Share Room Code
          </label>
          <div className="flex gap-2">
            <input
              id="roomCode"
              type="text"
              value={roomCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomCode(e.target.value)}
              placeholder="Enter room code"
              className="flex-1 h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && shareRoomCode()}
            />
            <button
              onClick={shareRoomCode}
              disabled={loading || !roomCode.trim()}
              className="px-4 h-10 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Share
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="px-4 py-3 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            className="px-4 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
