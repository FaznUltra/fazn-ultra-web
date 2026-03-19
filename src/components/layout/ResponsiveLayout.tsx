'use client';

import { useEffect, useState } from 'react';
import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './DesktopLayout';

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
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

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  // Use desktop layout for large screens, mobile layout for smaller screens
  if (isDesktop) {
    return <DesktopLayout>{children}</DesktopLayout>;
  }

  return <MobileLayout>{children}</MobileLayout>;
}
