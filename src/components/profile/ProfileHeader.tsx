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
    <div className="bg-gray-50 py-8 px-5 flex flex-col items-center">
      <div className="relative mb-4">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={displayName}
            width={100}
            height={100}
            className="rounded-full border-3 border-blue-600"
          />
        ) : (
          <div className="w-[100px] h-[100px] rounded-full bg-white border-3 border-blue-600 flex items-center justify-center">
            <User className="h-12 w-12 text-blue-600" />
          </div>
        )}
        {isVerified && (
          <div className="absolute bottom-0 right-0 bg-gray-50 rounded-full p-0.5">
            <CheckCircle className="h-6 w-6 text-green-500 fill-current" />
          </div>
        )}
      </div>

      <div className="text-center mb-5">
        <h1 className="text-2xl font-bold text-black mb-1">
          {firstName} {lastName}
        </h1>
        <p className="text-base text-gray-500 font-medium mb-1">{displayName}</p>
        <p className="text-sm text-gray-400">{email}</p>
      </div>

      <button
        onClick={onEditPress}
        className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-50 rounded-full"
      >
        <Edit className="h-[18px] w-[18px] text-blue-600" />
        <span className="text-[15px] font-semibold text-blue-600">Edit Profile</span>
      </button>
    </div>
  );
}
