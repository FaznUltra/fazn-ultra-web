'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Gamepad2, UserPlus, Users, CheckCircle, Trophy, Wallet, Info, Trash2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

type FilterType = 'all' | 'unread';

const notificationMeta: Record<string, { icon: any; color: string; bg: string }> = {
  CHALLENGE:           { icon: Gamepad2,     color: '#7C8CFF', bg: 'rgba(124,140,255,0.15)' },
  FRIEND_REQUEST:      { icon: UserPlus,     color: '#FF61D6', bg: 'rgba(255,97,214,0.15)'  },
  FRIEND_ACCEPT:       { icon: Users,        color: '#00FFB2', bg: 'rgba(0,255,178,0.12)'   },
  CHALLENGE_ACCEPTED:  { icon: CheckCircle,  color: '#00FFB2', bg: 'rgba(0,255,178,0.12)'   },
  CHALLENGE_COMPLETED: { icon: Trophy,       color: '#FBCB4A', bg: 'rgba(251,203,74,0.15)'  },
  PAYMENT:             { icon: Wallet,       color: '#FF9F43', bg: 'rgba(255,159,67,0.15)'  },
  SYSTEM:              { icon: Info,         color: '#7C8CFF', bg: 'rgba(124,140,255,0.10)' },
};

const fallbackMeta = { icon: Bell, color: '#7C8CFF', bg: 'rgba(124,140,255,0.12)' };

const formatTime = (dateString: string) => {
  const diff = new Date().getTime() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24)  return `${hrs}h ago`;
  if (days < 7)  return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
};

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');

  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification, unreadCount } =
    useNotifications({ isRead: filter === 'unread' ? false : undefined, limit: 100 });

  return (
    <div className="min-h-screen bg-[#03060b] text-white pb-24">

      {/* ── Header ── */}
      <div className="border-b border-white/[0.05]">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white/60" />
          </button>

          <button
            onClick={() => markAllAsRead()}
            disabled={unreadCount === 0}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all disabled:opacity-25"
            style={{ color: '#00FFB2', background: 'rgba(0,255,178,0.08)' }}
          >
            All read
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex px-4 gap-2 pb-2.5">
          {(['all', 'unread'] as FilterType[]).map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
                style={{
                  background: isActive ? '#00FFB2' : 'rgba(255,255,255,0.05)',
                  color:      isActive ? '#05070b' : 'rgba(255,255,255,0.4)',
                  border:     isActive ? '1px solid #00FFB2' : '1px solid transparent',
                }}
              >
                {tab}
                {tab === 'unread' && unreadCount > 0 && (
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-black rounded-full"
                    style={{
                      background: isActive ? '#05070b' : '#FF6B6B',
                      color:      isActive ? '#00FFB2' : '#fff',
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-4">

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div
              className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10"
              style={{ borderTopColor: '#00FFB2' }}
            />
          </div>
        )}

        {/* Empty */}
        {!isLoading && notifications.length === 0 && (
          <div className="text-center py-24 space-y-3">
            <div
              className="mx-auto h-14 w-14 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(0,255,178,0.07)' }}
            >
              <Bell className="h-5 w-5 text-[#00FFB2]" />
            </div>
            <p className="text-sm font-semibold text-white/30">
              {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
            </p>
            <p className="text-xs text-white/20">
              {filter === 'unread' ? "You've read everything." : "We'll let you know when something happens."}
            </p>
          </div>
        )}

        {/* List */}
        {!isLoading && notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const meta = notificationMeta[notification.type] ?? fallbackMeta;
              const Icon = meta.icon;
              const isUnread = !notification.isRead;

              return (
                <div
                  key={notification._id}
                  onClick={() => isUnread && markAsRead(notification._id)}
                  className="rounded-2xl border p-4 cursor-pointer transition-all hover:bg-white/[0.04] relative overflow-hidden"
                  style={{
                    borderColor:    isUnread ? `${meta.color}30` : 'rgba(255,255,255,0.05)',
                    background:     isUnread ? `${meta.bg.replace(')', ', 0.5)')}`  : 'rgba(255,255,255,0.02)',
                  }}
                >
                  {/* Unread left accent bar */}
                  {isUnread && (
                    <div
                      className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full"
                      style={{ background: meta.color }}
                    />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: meta.bg }}
                    >
                      <Icon className="h-4 w-4" style={{ color: meta.color }} />
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className="text-sm font-bold leading-snug text-white/90">
                          {notification.title}
                        </p>
                        {isUnread && (
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                            style={{ background: meta.color }}
                          />
                        )}
                      </div>

                      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/25 font-medium">
                          {formatTime(notification.createdAt)}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                          className="p-1.5 rounded-lg hover:bg-[#F87171]/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-[#F87171]/50 hover:text-[#F87171] transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}