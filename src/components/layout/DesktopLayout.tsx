'use client';

import { DesktopSidebar } from './DesktopSidebar';

export function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#03060b]">
      <DesktopSidebar />
      
      {/* Main Content Area */}
      <div className="pl-64">
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
