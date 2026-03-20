'use client';

import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ultra-bg)' }}>
      <TopBar />
      <main className="">{children}</main>
      <BottomNav />
    </div>
  );
}
