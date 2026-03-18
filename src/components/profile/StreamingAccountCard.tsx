'use client';

import { useState, useEffect } from 'react';
import { Youtube, Twitch, CheckCircle, Users, ExternalLink, Radio } from 'lucide-react';
import { streamingService, LiveStreamStatus } from '@/services/streaming.service';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Image from 'next/image';

interface StreamingAccountCardProps {
  platform: 'youtube' | 'twitch';
  isConnected: boolean;
  channelName?: string;
  channelUrl?: string;
  profileImage?: string;
  subscriberCount?: number;
  followerCount?: number;
}

export function StreamingAccountCard({ 
  platform, 
  isConnected, 
  channelName,
  channelUrl,
  profileImage,
  subscriberCount,
  followerCount
}: StreamingAccountCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();

  // Poll for live status every 30 seconds if connected
  const { data: liveStatusData } = useQuery({
    queryKey: ['live-status', platform],
    queryFn: platform === 'youtube' 
      ? streamingService.getYoutubeLiveStatus 
      : streamingService.getTwitchLiveStatus,
    enabled: isConnected,
    refetchInterval: 30000, // Poll every 30 seconds
    retry: false,
  });

  const liveStatus = liveStatusData?.data;

  const platformConfig = {
    youtube: {
      name: 'YouTube',
      icon: Youtube,
      color: '#FF0000',
      bgColor: 'bg-red-50',
      statLabel: 'Subscribers',
      statValue: subscriberCount,
    },
    twitch: {
      name: 'Twitch',
      icon: Twitch,
      color: '#9146FF',
      bgColor: 'bg-purple-50',
      statLabel: 'Followers',
      statValue: followerCount,
    },
  };

  const config = platformConfig[platform];
  const Icon = config.icon;

  const disconnectMutation = useMutation({
    mutationFn: platform === 'youtube' ? streamingService.disconnectYoutube : streamingService.disconnectTwitch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success(`${config.name} disconnected successfully`);
    },
    onError: () => {
      toast.error(`Failed to disconnect ${config.name}`);
    },
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = platform === 'youtube' 
        ? await streamingService.getYoutubeAuthUrl()
        : await streamingService.getTwitchAuthUrl();
      
      if (response.success && response.data?.authUrl) {
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      toast.error(`Failed to connect ${config.name}`);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm(`Are you sure you want to disconnect your ${config.name} account?`)) {
      disconnectMutation.mutate();
    }
  };

  if (!isConnected) {
    // Not connected - show simple card with connect button
    return (
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
              <Icon className="h-7 w-7" style={{ color: config.color }} />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{config.name}</p>
              <p className="text-sm text-gray-500">Not connected</p>
            </div>
          </div>
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </div>
    );
  }

  // Connected - show full details
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      {/* Header with platform name and connected status */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className="h-5 w-5" style={{ color: config.color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">{config.name}</p>
            {liveStatus?.isLive && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 rounded-full">
                <Radio className="h-3 w-3 text-red-600 animate-pulse" />
                <span className="text-xs font-bold text-red-600">LIVE</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Connected</span>
          </div>
        </div>
      </div>

      {/* Channel Details */}
      <div className="flex items-center gap-3 mb-4">
        {profileImage && (
          <Image
            src={profileImage}
            alt={channelName || config.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-900 truncate">{channelName}</p>
          {channelUrl && (
            <a 
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-0.5"
            >
              View Channel
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Live Stream Info */}
      {liveStatus?.isLive && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            {liveStatus.thumbnail && (
              <Image
                src={liveStatus.thumbnail}
                alt="Stream thumbnail"
                width={80}
                height={45}
                className="rounded object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                {liveStatus.title}
              </p>
              {liveStatus.viewerCount !== undefined && (
                <p className="text-xs text-gray-600 mb-2">
                  👁️ {liveStatus.viewerCount.toLocaleString()} viewers
                </p>
              )}
              {liveStatus.gameName && (
                <p className="text-xs text-gray-600 mb-2">
                  🎮 {liveStatus.gameName}
                </p>
              )}
              <a
                href={liveStatus.streamUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Watch Stream
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {config.statValue !== undefined && (
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 mb-4">
          <Users className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500 font-medium">{config.statLabel}</p>
            <p className="text-lg font-bold text-gray-900">
              {config.statValue.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Disconnect Button */}
      <button 
        onClick={handleDisconnect}
        disabled={disconnectMutation.isPending}
        className="w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect Account'}
      </button>
    </div>
  );
}
