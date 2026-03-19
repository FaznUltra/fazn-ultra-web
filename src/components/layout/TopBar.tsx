'use client';

import { Bell, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import { useWallet } from '@/hooks/useWallet';

export function TopBar() {
  const { unreadCount } = useNotifications();
  const { wallet } = useWallet();

  const balance = wallet?.currencies?.find((c) => c.code === 'NGN')?.balance || 0;

  return (
    <header className="sticky top-0 z-40" style={{ background: 'linear-gradient(90deg, #050709 0%, #0F1621 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center" aria-label="FAZN Home">
          <span className="font-display tracking-[0.4em] text-lg md:text-xl text-white">
            FAZN
            <span className="text-[#00FFB2]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/wallet"
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>₦{balance.toLocaleString()}</span>
          </Link>

          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Bell className="h-4 w-4" style={{ color: '#00FFB2' }} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: 'var(--ultra-danger)' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
