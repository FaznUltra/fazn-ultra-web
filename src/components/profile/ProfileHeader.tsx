'use client';

import Image from 'next/image';
import { User, CheckCircle, Edit, Sparkles } from 'lucide-react';

interface ProfileHeaderProps {
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string | null;
  isVerified: boolean;
  onEditPress: () => void;
}

export function ProfileHeader({
  displayName,
  firstName,
  lastName,
  email,
  profileImage,
  isVerified,
  onEditPress,
}: ProfileHeaderProps) {
  return (
    <div className="py-8 px-5 flex flex-col items-center">
      <div className="relative mb-4">
        {profileImage ? (
          <div className="relative">
            <Image
              src={profileImage}
              alt={displayName}
              width={96}
              height={96}
              className="rounded-3xl"
              style={{ border: '3px solid #00FFB2' }}
            />
            <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: '0 0 40px rgba(0,255,178,0.3)' }} />
          </div>
        ) : (
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(0,255,178,0.12)', border: '3px solid #00FFB2' }}>
              <User className="h-10 w-10 text-[#00FFB2]" />
            </div>
            <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: '0 0 40px rgba(0,255,178,0.3)' }} />
          </div>
        )}
        {isVerified && (
          <div className="absolute -bottom-1 -right-1 bg-[#05070C] rounded-full p-1 border-2 border-[#00FFB2]">
            <CheckCircle className="h-6 w-6 text-[#00FFB2] fill-current" />
          </div>
        )}
      </div>

      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-white">
            {firstName} {lastName}
          </h1>
          {isVerified && <Sparkles className="h-4 w-4 text-[#FBCB4A]" />}
        </div>
        <p className="text-sm font-semibold text-[#00FFB2] mb-1">{displayName}</p>
        <p className="text-xs text-white/40">{email}</p>
      </div>

      <button
        onClick={onEditPress}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: 'rgba(0,255,178,0.12)', color: '#00FFB2', border: '1px solid rgba(0,255,178,0.2)' }}
      >
        <Edit className="h-4 w-4" />
        Edit Profile
      </button>
    </div>
  );
}
