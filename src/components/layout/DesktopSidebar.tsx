'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Plus, Users, User, Wallet, Bell, HelpCircle, History, LogOut } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/hooks/useAuth';
import { useChallengeHistory } from '@/hooks/useChallenges';
import { MiniPerformanceWidget } from '@/components/charts/MiniPerformanceWidget';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Challenges', href: '/challenges', icon: Trophy },
  { name: 'Create Challenge', href: '/create-challenge', icon: Plus, isPrimary: true },
  { name: 'Friends', href: '/friends', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'History', href: '/challenge-history', icon: History },
  { name: 'Help & Support', href: '/help-support', icon: HelpCircle },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const { wallet } = useWallet();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: historyData } = useChallengeHistory({ limit: 50 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showLogoutModal]);

  const balance = wallet?.currencies?.find((c) => c.code === 'NGN')?.balance || 0;

  return (
    <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-64 border-r border-white/10" style={{ background: 'linear-gradient(180deg, #050709 0%, #0F1621 100%)' }}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center justify-center">
          <span className="font-display tracking-[0.4em] text-2xl text-white">
            FAZN
            <span className="text-[#00FFB2]">.</span>
          </span>
        </Link>
      </div>

      {/* Wallet Balance */}
      <div className="px-4 py-4 border-b border-white/10">
        <Link
          href="/wallet"
          className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/5"
          style={{ background: 'rgba(0,255,178,0.08)', border: '1px solid rgba(0,255,178,0.2)' }}
        >
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#00FFB2]" />
            <span className="text-sm font-semibold text-white">Balance</span>
          </div>
          <span className="text-sm font-bold text-[#00FFB2]">₦{balance.toLocaleString()}</span>
        </Link>
        
        {/* Mini Performance Widget */}
        <MiniPerformanceWidget 
          challengeHistory={historyData?.data?.challenges || []}
          userId={user?._id}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            if (item.isPrimary) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: '#00FFB2', color: '#05070b' }}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                  <span>{item.name}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: isActive ? '#00FFB2' : 'rgba(255,255,255,0.6)',
                }}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.name}</span>
                {item.href === '/notifications' && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: '#FF6B6B' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Notifications & Logout */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/notifications"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: '#FF6B6B' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {mounted && showLogoutModal && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center p-4" 
          style={{ 
            background: 'rgba(0,0,0,0.85)',
            zIndex: 999999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#0F1523' }}>
            <h3 className="text-xl font-bold text-white mb-2">Log Out?</h3>
            <p className="text-white/60 text-sm mb-6">Are you sure you want to log out of your account?</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: '#FF6B6B', color: 'white' }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
}
