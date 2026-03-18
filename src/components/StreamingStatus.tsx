'use client';

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface StreamingStatusProps {
  userId: string;
  username: string;
  className?: string;
}

export function StreamingStatus({ userId, username, className = '' }: StreamingStatusProps) {
  const [isLive, setIsLive] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [platform, setPlatform] = useState<'YOUTUBE' | 'TWITCH' | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await api.get(`/streaming/status/${userId}`);
        // setIsLive(response.data.isLive);
        // setStreamUrl(response.data.streamUrl);
        // setPlatform(response.data.platform);
        
        // Simulate for now
        setIsLive(false);
        setStreamUrl(null);
        setPlatform(null);
      } catch (error) {
        console.error('Error checking streaming status:', error);
      }
    };

    checkStatus();
    
    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div 
          className={`w-2.5 h-2.5 rounded-full ${
            isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
          }`} 
        />
        <span className="text-sm font-medium">
          {username}
        </span>
      </div>
      
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        isLive 
          ? 'bg-green-100 text-green-700 font-semibold' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {isLive ? '🔴 LIVE' : 'Offline'}
      </span>

      {isLive && streamUrl && (
        <a 
          href={streamUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs"
        >
          Watch
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}
