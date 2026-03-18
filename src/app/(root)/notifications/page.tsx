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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'CHALLENGE':
        return { bg: 'bg-blue-50', text: 'text-blue-600' };
      case 'FRIEND_REQUEST':
        return { bg: 'bg-purple-50', text: 'text-purple-600' };
      case 'FRIEND_ACCEPT':
        return { bg: 'bg-green-50', text: 'text-green-600' };
      case 'CHALLENGE_ACCEPTED':
        return { bg: 'bg-green-50', text: 'text-green-600' };
      case 'CHALLENGE_COMPLETED':
        return { bg: 'bg-yellow-50', text: 'text-yellow-600' };
      case 'PAYMENT':
        return { bg: 'bg-orange-50', text: 'text-orange-600' };
      case 'SYSTEM':
        return { bg: 'bg-gray-50', text: 'text-gray-600' };
      default:
        return { bg: 'bg-blue-50', text: 'text-blue-600' };
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
          <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
          <button
            onClick={() => markAllAsRead()}
            disabled={unreadCount === 0}
            className="text-sm font-semibold text-blue-600 disabled:text-gray-400"
          >
            Mark all read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              filter === 'all' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            All
            {filter === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              filter === 'unread' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            {filter === 'unread' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colors = getNotificationColor(notification.type);

              return (
                <div
                  key={notification._id}
                  className={`bg-white rounded-2xl p-4 border shadow-sm ${
                    notification.isRead ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          {formatTime(notification.createdAt)}
                        </p>
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
