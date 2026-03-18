'use client';

import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <main className="pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
