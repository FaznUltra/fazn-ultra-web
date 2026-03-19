'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Plus, Users, User } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Challenges', href: '/challenges', icon: Trophy },
  { name: 'Create', href: '/create-challenge', icon: Plus, isSpecial: true },
  { name: 'Friends', href: '/friends', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ background: 'var(--ultra-nav)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          if (item.isSpecial) {
            return (
              <Link key={item.name} href={item.href} className="relative -mt-6">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--ultra-primary), var(--ultra-primary-dark))',
                    borderColor: 'var(--ultra-nav)',
                    border: '3px solid var(--ultra-nav)',
                    boxShadow: '0 4px 15px rgba(79,70,229,0.4)',
                  }}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all"
            >
              <Icon
                className="h-5 w-5 transition-colors"
                style={{ color: isActive ? '#A5B4FC' : 'rgba(255,255,255,0.35)' }}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? '#A5B4FC' : 'rgba(255,255,255,0.35)' }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
