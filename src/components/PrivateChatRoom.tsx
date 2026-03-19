'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Send, Lock, Copy } from 'lucide-react';
import { privateChatService, PrivateChatMessage } from '@/services/privateChat.service';
import { useAuth } from '@/hooks/useAuth';
import { getSocket, connectSocket, disconnectSocket, joinChatRoom, leaveChatRoom, sendChatMessage } from '@/lib/socket';

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
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get unique participants from messages
  const participants = Array.from(
    new Set(
      messages.map(msg => msg.senderUsername)
    )
  ).filter(name => name !== user?.displayName);

  // Initialize WebSocket and fetch initial messages
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token found in localStorage');
      return;
    }

    console.log('🔌 Initializing WebSocket connection...');
    
    // Connect socket
    connectSocket(token);
    const socket = getSocket();

    console.log('🔌 Socket instance:', socket.id, 'Connected:', socket.connected);

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        console.log('📥 Fetching initial messages for challenge:', challengeId);
        const response = await privateChatService.getPrivateChatMessages(challengeId);
        console.log('✅ Messages fetched:', response.data.messages.length);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('❌ Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Wait for socket to connect before joining room
    const joinRoom = () => {
      if (socket.connected) {
        console.log('✅ Socket connected, joining room:', challengeId);
        joinChatRoom(challengeId);
      } else {
        console.log('⏳ Waiting for socket connection...');
        socket.once('connect', () => {
          console.log('✅ Socket connected! Joining room:', challengeId);
          joinChatRoom(challengeId);
        });
      }
    };

    joinRoom();

    // Listen for new messages
    socket.on('newPrivateMessage', (message: PrivateChatMessage) => {
      console.log('📨 New message received:', message);
      setMessages((prev) => [...prev, message]);
    });

    // Listen for room code shared
    socket.on('roomCodeShared', (data: { roomCode: string; message: PrivateChatMessage }) => {
      console.log('🔑 Room code shared:', data);
      setMessages((prev) => [...prev, data.message]);
      toast.success('Room code shared!');
    });

    // Listen for errors
    socket.on('error', (error: any) => {
      console.error('❌ Socket error:', error);
      toast.error(error.message || 'Chat error occurred');
    });

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up socket listeners for:', challengeId);
      leaveChatRoom(challengeId);
      socket.off('newPrivateMessage');
      socket.off('roomCodeShared');
      socket.off('error');
    };
  }, [challengeId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

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
    const beforeMention = newMessage.slice(0, mentionPosition);
    const afterMention = newMessage.slice(mentionPosition + mentionSearch.length + 1);
    const newText = `${beforeMention}@${username} ${afterMention}`;
    setNewMessage(newText);
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
        handleMentionSelect(filteredParticipants[selectedMentionIndex]);
        return;
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredParticipants = participants.filter(name =>
    name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      console.log('📤 Sending message:', { challengeId, message: newMessage });
      const socket = getSocket();
      console.log('🔌 Socket connected:', socket.connected);
      
      if (!socket.connected) {
        console.error('❌ Socket not connected, attempting to reconnect...');
        const token = localStorage.getItem('token');
        if (token) {
          connectSocket(token);
        }
        toast.error('Connection lost. Please try again.');
        setLoading(false);
        return;
      }
      
      // Send via WebSocket for instant delivery
      sendChatMessage(challengeId, newMessage, 'TEXT');
      console.log('✅ Message sent successfully');
      setNewMessage('');
    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleShareRoomCode = async () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    setLoading(true);
    try {
      // Send via WebSocket for instant delivery
      sendChatMessage(challengeId, roomCode, 'ROOM_CODE');
      setRoomCode('');
      toast.success('Room code shared!');
    } catch (error) {
      toast.error('Failed to share room code');
    } finally {
      setLoading(false);
    }
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Room code copied to clipboard');
  };

  return (
    <div className="flex flex-col h-[500px] bg-[#0A0F1A] rounded-lg border border-white/10">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10" style={{ background: 'rgba(0,255,178,0.05)' }}>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#00FFB2]" />
          <h3 className="font-semibold text-sm text-white">Private Chat</h3>
          <span className="text-xs text-white/40">(Creator, Acceptor, Witness only)</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ background: '#050709' }}>
        {messages.length === 0 ? (
          <div className="text-center text-white/40 text-sm py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-lg ${
                msg.type === 'ROOM_CODE' 
                  ? 'border border-[#00FFB2]/30 ml-8' 
                  : msg.type === 'SYSTEM'
                  ? 'border border-white/10'
                  : msg.senderId === user?._id
                  ? 'border border-[#7C8CFF]/30 ml-8'
                  : 'border border-white/10 mr-8'
              }`}
              style={{
                background: msg.type === 'ROOM_CODE'
                  ? 'rgba(0,255,178,0.08)'
                  : msg.type === 'SYSTEM'
                  ? 'rgba(255,255,255,0.03)'
                  : msg.senderId === user?._id
                  ? 'rgba(124,140,255,0.08)'
                  : 'rgba(255,255,255,0.05)'
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-white/70 mb-1">
                    {msg.senderUsername}
                  </p>
                  <p className="text-sm break-words text-white/90">
                    {msg.message.split(/(@\w+)/g).map((part, i) => 
                      part.startsWith('@') ? (
                        <span key={i} className="text-[#00FFB2] font-semibold">{part}</span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                </div>
                
                {msg.type === 'ROOM_CODE' && (
                  <button
                    onClick={() => {
                      const code = msg.message.replace('Room Code: ', '');
                      copyRoomCode(code);
                    }}
                    className="shrink-0 p-1.5 hover:bg-[#00FFB2]/20 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 text-[#00FFB2]" />
                  </button>
                )}
              </div>
              
              <p className="text-xs text-white/30 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Room Code Input (Creator Only) */}
      {isCreator && (
        <div className="px-4 py-3 border-t border-white/10" style={{ background: 'rgba(0,255,178,0.05)' }}>
          <label htmlFor="roomCode" className="text-xs font-semibold mb-2 block text-[#00FFB2]">
            Share Room Code
          </label>
          <div className="flex gap-2">
            <input
              id="roomCode"
              type="text"
              value={roomCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomCode(e.target.value)}
              placeholder="Enter room code"
              className="flex-1 h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:border-[#00FFB2]/50 focus:outline-none focus:ring-1 focus:ring-[#00FFB2]/50"
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleShareRoomCode()}
            />
            <button
              onClick={handleShareRoomCode}
              disabled={loading || !roomCode.trim()}
              className="px-4 h-10 text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ background: '#00FFB2', color: '#05070b' }}
            >
              Share
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="px-4 py-3 border-t border-white/10 relative" style={{ background: '#0A0F1A' }}>
        {/* Mention Dropdown */}
        {showMentions && filteredParticipants.length > 0 && (
          <div 
            className="absolute bottom-full left-4 right-4 mb-2 rounded-lg border border-white/10 overflow-hidden shadow-2xl"
            style={{ background: '#0F1523', maxHeight: '200px' }}
          >
            <div className="p-2 border-b border-white/10">
              <p className="text-xs text-white/50">Mention someone</p>
            </div>
            <div className="overflow-y-auto max-h-[160px]">
              {filteredParticipants.map((participant, index) => (
                <button
                  key={participant}
                  onClick={() => handleMentionSelect(participant)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    index === selectedMentionIndex
                      ? 'bg-[#7C8CFF]/20 text-[#7C8CFF]'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <span className="font-semibold">@{participant}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (use @ to mention)"
              className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:border-[#7C8CFF]/50 focus:outline-none focus:ring-1 focus:ring-[#7C8CFF]/50"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={loading || !newMessage.trim()}
            className="px-4 h-10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            style={{ background: '#7C8CFF', color: '#fff' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
