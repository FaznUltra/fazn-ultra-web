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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-base font-bold text-gray-900 truncate">{ticket.subject}</h1>
            <p className="text-xs text-gray-500 uppercase">{ticket.status.replace('_', ' ')}</p>
          </div>
          {ticket.status !== 'closed' && (
            <button
              onClick={handleCloseTicket}
              disabled={isClosing}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-red-50 transition-colors"
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {ticket.messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.message}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
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
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
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
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none resize-none"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSendingMessage}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              {isSendingMessage ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
