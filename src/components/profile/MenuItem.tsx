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
      className="flex items-center w-full py-4 px-4 transition-all hover:bg-white/[0.03] active:bg-white/[0.05] group"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mr-3.5 flex-shrink-0 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${iconColor}20` }}
      >
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-semibold text-white group-hover:text-white/90 transition-colors">{title}</p>
        <p className="text-[11px] text-white/40 group-hover:text-white/50 transition-colors">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0 text-white/30 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}
