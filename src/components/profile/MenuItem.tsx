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
      className="flex items-center w-full bg-white py-4 px-5 border-b border-gray-50 active:bg-gray-50 transition-colors"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <Icon className="h-6 w-6" style={{ color: iconColor }} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-base font-semibold text-black mb-0.5">{title}</p>
        <p className="text-[13px] text-gray-500">{subtitle}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-300 ml-2" />
    </button>
  );
}
