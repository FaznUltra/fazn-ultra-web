'use client';

import { LucideIcon, ChevronRight } from 'lucide-react';

interface MenuItemProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export function MenuItem({ icon: Icon, iconColor, title, subtitle, onPress }: MenuItemProps) {
  return (
    <button
      onClick={onPress}
      className="flex items-center w-full py-3 px-4 transition-colors"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mr-3 flex-shrink-0"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--ultra-text)' }}>{title}</p>
        <p className="text-[11px]" style={{ color: 'var(--ultra-text-muted)' }}>{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" style={{ color: 'var(--ultra-text-muted)' }} />
    </button>
  );
}
