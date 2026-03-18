'use client';

import { Bell, Wallet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useNotifications } from '@/hooks/useNotifications';
import { useWallet } from '@/hooks/useWallet';

export function TopBar() {
  const { unreadCount } = useNotifications();
  const { wallet } = useWallet();

  const balance = wallet?.currencies?.find((c) => c.code === 'NGN')?.balance || 0;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/fazn-light.png"
            alt="Ultra"
            width={300}
            height={80}
            priority
            className="h-[80px] w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/wallet"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-semibold">
              ₦{balance.toLocaleString()}
            </span>
          </Link>

          <Link href="/notifications" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="h-5 w-5 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
