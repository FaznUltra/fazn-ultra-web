'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, HelpCircle, User as UserIcon, Wallet, Gamepad2, Settings, MessageCircle } from 'lucide-react';
import { useSupport } from '@/hooks/useSupport';
import { SupportTicket } from '@/services/support.service';

export default function HelpSupportPage() {
  const router = useRouter();
  const { tickets, isLoading, refetch } = useSupport({ limit: 50 });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-orange-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'account':
        return UserIcon;
      case 'payment':
        return Wallet;
      case 'challenge':
        return Gamepad2;
      case 'technical':
        return Settings;
      case 'other':
        return HelpCircle;
      default:
        return HelpCircle;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusStyle = (status: string): { bg: string; color: string } => {
    switch (status) {
      case 'open': return { bg: '#FFF7ED', color: '#EA580C' };
      case 'in_progress': return { bg: '#EEF2FF', color: '#4F46E5' };
      case 'resolved': return { bg: '#ECFDF5', color: '#059669' };
      case 'closed': return { bg: '#F1F5F9', color: '#64748B' };
      default: return { bg: '#F1F5F9', color: '#64748B' };
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--ultra-text)' }} />
          </button>
          <h1 className="text-base font-bold" style={{ color: 'var(--ultra-text)' }}>Help & Support</h1>
          <button
            onClick={() => router.push('/create-support-ticket')}
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: 'var(--ultra-primary)', color: 'white' }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--ultra-primary-light)' }}>
              <HelpCircle className="h-5 w-5" style={{ color: 'var(--ultra-primary)' }} />
            </div>
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--ultra-text)' }}>No Support Tickets</p>
            <p className="text-xs mb-4" style={{ color: 'var(--ultra-text-muted)' }}>Create a ticket if you need help</p>
            <button
              onClick={() => router.push('/create-support-ticket')}
              className="px-6 py-2.5 text-white rounded-xl text-sm font-semibold transition-colors"
              style={{ background: 'var(--ultra-primary)' }}
            >
              Create Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket: SupportTicket) => {
              const Icon = getCategoryIcon(ticket.category);
              const statusStyle = getStatusStyle(ticket.status);
              return (
                <button
                  key={ticket._id}
                  onClick={() => router.push(`/support/${ticket._id}`)}
                  className="w-full bg-white rounded-2xl p-4 transition-all text-left"
                  style={{ boxShadow: 'var(--ultra-card-shadow)' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ultra-primary-light)' }}>
                      <Icon className="h-4 w-4" style={{ color: 'var(--ultra-primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate mb-0.5" style={{ color: 'var(--ultra-text)' }}>
                        {ticket.subject}
                      </p>
                      <p className="text-[10px] font-semibold uppercase" style={{ color: 'var(--ultra-text-muted)' }}>
                        {ticket.category}
                      </p>
                    </div>
                    <div className="px-2 py-0.5 rounded-lg" style={{ background: statusStyle.bg }}>
                      <p className="text-[10px] font-bold uppercase" style={{ color: statusStyle.color }}>
                        {ticket.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--ultra-text-secondary)' }}>
                    {ticket.messages[ticket.messages.length - 1]?.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--ultra-text-muted)' }}>
                      <MessageCircle className="h-3 w-3" />
                      <span>{ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}</span>
                    </div>
                    <p className="text-[10px]" style={{ color: 'var(--ultra-text-muted)' }}>{formatDate(ticket.updatedAt)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
