'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send, X } from 'lucide-react';
import { useSupportTicket } from '@/hooks/useSupport';

export default function SupportTicketPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;
  const { ticket, isLoading, addMessage, isSendingMessage, closeTicket, isClosing } = useSupportTicket(ticketId);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || isSendingMessage) return;
    addMessage(message.trim(), {
      onSuccess: () => {
        setMessage('');
      },
    });
  };

  const handleCloseTicket = () => {
    if (window.confirm('Are you sure you want to close this ticket?')) {
      closeTicket(undefined, {
        onSuccess: () => {
          router.back();
        },
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#03060b] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10 border-t-[#00FFB2]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#03060b] flex items-center justify-center">
        <p className="text-sm text-white/40">Ticket not found</p>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (ticket.status) {
      case 'open': return '#FF9F43';
      case 'in_progress': return '#7C8CFF';
      case 'resolved': return '#00FFB2';
      case 'closed': return 'rgba(255,255,255,0.4)';
      default: return 'rgba(255,255,255,0.4)';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#03060b]">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5" style={{ background: 'rgba(3,6,11,0.95)' }}>
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
          <div className="flex-1 text-center mx-3">
            <h1 className="text-sm font-bold truncate text-white">{ticket.subject}</h1>
            <p className="text-[10px] uppercase font-bold tracking-wide" style={{ color: getStatusColor() }}>{ticket.status.replace('_', ' ')}</p>
          </div>
          {ticket.status !== 'closed' && (
            <button
              onClick={handleCloseTicket}
              disabled={isClosing}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4 text-[#FF6B6B]" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {ticket.messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[80%] rounded-2xl px-4 py-3"
              style={msg.sender === 'user'
                ? { background: '#00FFB2', color: '#05070b' }
                : { background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              <p className="text-sm leading-relaxed">{msg.message}</p>
              <p
                className="text-[10px] mt-1.5 font-medium"
                style={{ color: msg.sender === 'user' ? 'rgba(5,7,11,0.5)' : 'rgba(255,255,255,0.4)' }}
              >
                {formatTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {ticket.status !== 'closed' && (
        <div className="p-4 border-t border-white/5" style={{ background: 'rgba(3,6,11,0.95)' }}>
          <div className="flex items-end gap-2">
            <div className="flex-1 rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus-within:ring-2 focus-within:ring-[#00FFB2]/50 focus-within:border-[#00FFB2]/50 transition-all">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                rows={1}
                className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none resize-none"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSendingMessage}
              className="flex h-11 w-11 items-center justify-center rounded-xl disabled:opacity-50 transition-all hover:scale-[1.05] active:scale-[0.95] flex-shrink-0"
              style={{ background: '#00FFB2', color: '#05070b' }}
            >
              {isSendingMessage ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#05070b]/20 border-t-[#05070b]"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
