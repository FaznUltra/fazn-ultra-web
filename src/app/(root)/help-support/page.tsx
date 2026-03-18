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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Help & Support</h1>
          <button
            onClick={() => router.push('/create-support-ticket')}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-6 w-6 text-blue-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 mb-2">No Support Tickets</p>
            <p className="text-gray-500 mb-6">Create a ticket if you need help</p>
            <button
              onClick={() => router.push('/create-support-ticket')}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket: SupportTicket) => {
              const Icon = getCategoryIcon(ticket.category);
              return (
                <button
                  key={ticket._id}
                  onClick={() => router.push(`/support/${ticket._id}`)}
                  className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-gray-900 truncate mb-0.5">
                        {ticket.subject}
                      </p>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase">
                        {ticket.category}
                      </p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-xl ${getStatusColor(ticket.status)}`}>
                      <p className="text-[10px] font-bold text-white uppercase">
                        {ticket.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {ticket.messages[ticket.messages.length - 1]?.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>
                        {ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(ticket.updatedAt)}</p>
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
