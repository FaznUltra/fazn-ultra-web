'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Gamepad2, UserPlus, Users, CheckCircle, Trophy, Wallet, Info, Trash2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications({
    isRead: filter === 'unread' ? false : undefined,
    limit: 100,
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CHALLENGE':
        return Gamepad2;
      case 'FRIEND_REQUEST':
        return UserPlus;
      case 'FRIEND_ACCEPT':
        return Users;
      case 'CHALLENGE_ACCEPTED':
        return CheckCircle;
      case 'CHALLENGE_COMPLETED':
        return Trophy;
      case 'PAYMENT':
        return Wallet;
      case 'SYSTEM':
        return Info;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string): { bg: string; color: string } => {
    switch (type) {
      case 'CHALLENGE':
        return { bg: '#EEF2FF', color: '#4F46E5' };
      case 'FRIEND_REQUEST':
        return { bg: '#F5F3FF', color: '#7C3AED' };
      case 'FRIEND_ACCEPT':
        return { bg: '#ECFDF5', color: '#059669' };
      case 'CHALLENGE_ACCEPTED':
        return { bg: '#ECFDF5', color: '#059669' };
      case 'CHALLENGE_COMPLETED':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'PAYMENT':
        return { bg: '#FFF7ED', color: '#EA580C' };
      case 'SYSTEM':
        return { bg: '#F1F5F9', color: '#64748B' };
      default:
        return { bg: '#EEF2FF', color: '#4F46E5' };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--ultra-text)' }} />
          </button>
          <h1 className="text-base font-bold" style={{ color: 'var(--ultra-text)' }}>Notifications</h1>
          <button
            onClick={() => markAllAsRead()}
            disabled={unreadCount === 0}
            className="text-xs font-semibold disabled:opacity-40"
            style={{ color: 'var(--ultra-primary)' }}
          >
            Mark all read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
          {(['all', 'unread'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors capitalize relative"
              style={{
                color: filter === tab ? 'var(--ultra-primary)' : 'var(--ultra-text-muted)',
                borderBottom: filter === tab ? '2px solid var(--ultra-primary)' : '2px solid transparent',
              }}
            >
              {tab}
              {tab === 'unread' && unreadCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white rounded-full" style={{ background: '#DC2626' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--ultra-primary-light)' }}>
              <Bell className="h-5 w-5" style={{ color: 'var(--ultra-primary)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--ultra-text-secondary)' }}>No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colors = getNotificationColor(notification.type);

              return (
                <div
                  key={notification._id}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                  className="bg-white rounded-2xl p-4 cursor-pointer transition-all"
                  style={{
                    boxShadow: 'var(--ultra-card-shadow)',
                    borderLeft: notification.isRead ? 'none' : `3px solid var(--ultra-primary)`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: colors.bg }}>
                      <Icon className="h-4 w-4" style={{ color: colors.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className="text-sm font-semibold" style={{ color: 'var(--ultra-text)' }}>{notification.title}</p>
                        {!notification.isRead && (
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: 'var(--ultra-primary)' }} />
                        )}
                      </div>
                      <p className="text-xs line-clamp-2 mb-1.5" style={{ color: 'var(--ultra-text-secondary)' }}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px]" style={{ color: 'var(--ultra-text-muted)' }}>
                          {formatTime(notification.createdAt)}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                          className="p-1 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" style={{ color: '#DC2626' }} />
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
