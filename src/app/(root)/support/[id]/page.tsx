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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--ultra-text-muted)' }}>Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--ultra-text)' }} />
          </button>
          <div className="flex-1 text-center mx-3">
            <h1 className="text-sm font-bold truncate" style={{ color: 'var(--ultra-text)' }}>{ticket.subject}</h1>
            <p className="text-[10px] uppercase" style={{ color: 'var(--ultra-text-muted)' }}>{ticket.status.replace('_', ' ')}</p>
          </div>
          {ticket.status !== 'closed' && (
            <button
              onClick={handleCloseTicket}
              disabled={isClosing}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            >
              <X className="h-4 w-4" style={{ color: '#DC2626' }} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'var(--ultra-bg)' }}>
        {ticket.messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2.5"
              style={msg.sender === 'user'
                ? { background: 'var(--ultra-primary)', color: 'white' }
                : { background: 'white', color: 'var(--ultra-text)', boxShadow: 'var(--ultra-card-shadow)' }
              }
            >
              <p className="text-sm leading-relaxed">{msg.message}</p>
              <p
                className="text-[10px] mt-1"
                style={{ color: msg.sender === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--ultra-text-muted)' }}
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
        <div className="bg-white p-3" style={{ borderTop: '1px solid var(--ultra-border)' }}>
          <div className="flex items-end gap-2">
            <div className="flex-1 rounded-xl px-3 py-2.5" style={{ background: 'var(--ultra-bg)', border: '1px solid var(--ultra-border)' }}>
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
                className="w-full bg-transparent text-sm placeholder-gray-400 focus:outline-none resize-none"
                style={{ color: 'var(--ultra-text)' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSendingMessage}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white disabled:opacity-50 transition-colors flex-shrink-0"
              style={{ background: 'var(--ultra-primary)' }}
            >
              {isSendingMessage ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
