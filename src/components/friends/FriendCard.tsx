'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, MoreVertical, UserMinus } from 'lucide-react';
import { Friendship } from '@/services/friendship.service';

interface FriendCardProps {
  friendship: Friendship;
  onUnfriend: (userId: string) => void;
}

export function FriendCard({ friendship, onUnfriend }: FriendCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // For accepted friendships, the API should return the friend as either requester or recipient
  // We need to determine which one is NOT the current user
  // For now, we'll use recipient as the default (this should ideally be handled by the API)
  const friend = friendship.recipient;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 6,
        left: rect.right - 140 // 140px is min-width of menu
      });
    }
  }, [menuOpen]);

  // Close menu on scroll to prevent stagnant positioning
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      window.addEventListener('scroll', handleScroll, true);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [menuOpen]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4 flex items-center gap-3 relative">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(0,255,178,0.12)' }}
      >
        <User className="h-4 w-4" style={{ color: '#00FFB2' }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate text-white">{friend.displayName}</p>
        <p className="text-[11px] truncate text-white/40">{friend.email}</p>
      </div>

      {/* Actions menu */}
      <div>
        <button
          ref={buttonRef}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-white/[0.07]"
        >
          <MoreVertical className="h-4 w-4 text-white/30" />
        </button>

        {mounted && menuOpen && createPortal(
          <div
            ref={menuRef}
            className="rounded-xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden min-w-[140px]"
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 999999
            }}
          >
            <button
              onClick={() => { onUnfriend(friend._id); setMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold transition-colors hover:bg-white/[0.05]"
              style={{ color: '#F87171' }}
            >
              <UserMinus className="h-3.5 w-3.5" />
              Unfriend
            </button>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}