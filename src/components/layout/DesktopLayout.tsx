'use client';

import { DesktopSidebar } from './DesktopSidebar';
import { TopBar } from './TopBar';

export function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ultra-bg)' }}>
      <DesktopSidebar />
      
      {/* Main Content Area */}
      <div className="lg:pl-64">
        <TopBar />
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
