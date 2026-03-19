'use client';

import { useEffect, useState } from 'react';
import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './DesktopLayout';

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if window width is desktop size (1024px and above)
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initial check
    checkDesktop();

    // Add resize listener
    window.addEventListener('resize', checkDesktop);

    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Use desktop layout for large screens, mobile layout for smaller screens
  if (isDesktop) {
    return <DesktopLayout>{children}</DesktopLayout>;
  }

  return <MobileLayout>{children}</MobileLayout>;
}
