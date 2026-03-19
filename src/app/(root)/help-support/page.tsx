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
      case 'open': return { bg: 'rgba(255,159,67,0.12)', color: '#FF9F43' };
      case 'in_progress': return { bg: 'rgba(124,140,255,0.12)', color: '#7C8CFF' };
      case 'resolved': return { bg: 'rgba(0,255,178,0.12)', color: '#00FFB2' };
      case 'closed': return { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' };
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'account': return '#7C8CFF';
      case 'payment': return '#FBCB4A';
      case 'challenge': return '#00FFB2';
      case 'technical': return '#FF6B6B';
      case 'other': return '#FF61D6';
      default: return '#00FFB2';
    }
  };

  return (
    <div className="min-h-screen bg-[#03060b] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5" style={{ background: 'rgba(3,6,11,0.8)' }}>
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
          <h1 className="text-base font-bold">Help & Support</h1>
          <button
            onClick={() => router.push('/create-support-ticket')}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-[1.05] active:scale-[0.95]"
            style={{ background: '#00FFB2', color: '#05070b' }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10 border-t-[#00FFB2]" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-16 w-16 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(0,255,178,0.12)' }}>
              <HelpCircle className="h-7 w-7 text-[#00FFB2]" />
            </div>
            <p className="text-sm font-bold mb-2 text-white">No Support Tickets</p>
            <p className="text-xs mb-6 text-white/40">Create a ticket if you need help</p>
            <button
              onClick={() => router.push('/create-support-ticket')}
              className="px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: '#00FFB2', color: '#05070b' }}
            >
              Create Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket: SupportTicket) => {
              const Icon = getCategoryIcon(ticket.category);
              const statusStyle = getStatusStyle(ticket.status);
              const categoryColor = getCategoryColor(ticket.category);
              return (
                <button
                  key={ticket._id}
                  onClick={() => router.push(`/support/${ticket._id}`)}
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.04] backdrop-blur-xl p-4 transition-all hover:bg-white/[0.06] text-left group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: `${categoryColor}20` }}>
                      <Icon className="h-4 w-4" style={{ color: categoryColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate mb-1 text-white">
                        {ticket.subject}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">
                        {ticket.category}
                      </p>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg" style={{ background: statusStyle.bg }}>
                      <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: statusStyle.color }}>
                        {ticket.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs line-clamp-2 mb-3 text-white/60">
                    {ticket.messages[ticket.messages.length - 1]?.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                      <MessageCircle className="h-3 w-3" />
                      <span>{ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}</span>
                    </div>
                    <p className="text-[10px] text-white/40">{formatDate(ticket.updatedAt)}</p>
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
