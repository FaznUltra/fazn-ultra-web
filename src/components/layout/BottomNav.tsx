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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isSpecial) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative -mt-8"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-600/30 border-4 border-white">
                  <Icon className="h-8 w-8 text-white" strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon
                className="h-6 w-6"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[11px] font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
