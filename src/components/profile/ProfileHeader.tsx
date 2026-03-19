'use client';

import Image from 'next/image';
import { User, CheckCircle, Edit } from 'lucide-react';

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
    <div className="bg-white py-6 px-5 flex flex-col items-center">
      <div className="relative mb-3">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={displayName}
            width={80}
            height={80}
            className="rounded-full"
            style={{ border: '3px solid var(--ultra-primary)' }}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center" style={{ border: '3px solid var(--ultra-primary)' }}>
            <User className="h-9 w-9" style={{ color: 'var(--ultra-primary)' }} />
          </div>
        )}
        {isVerified && (
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
            <CheckCircle className="h-5 w-5 text-green-500 fill-current" />
          </div>
        )}
      </div>

      <div className="text-center mb-4">
        <h1 className="text-lg font-bold mb-0.5" style={{ color: 'var(--ultra-text)' }}>
          {firstName} {lastName}
        </h1>
        <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--ultra-text-secondary)' }}>{displayName}</p>
        <p className="text-xs" style={{ color: 'var(--ultra-text-muted)' }}>{email}</p>
      </div>

      <button
        onClick={onEditPress}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
        style={{ background: 'var(--ultra-primary-light)', color: 'var(--ultra-primary)' }}
      >
        <Edit className="h-3.5 w-3.5" />
        Edit Profile
      </button>
    </div>
  );
}
