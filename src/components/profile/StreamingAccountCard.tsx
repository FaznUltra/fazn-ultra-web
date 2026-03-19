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
    return (
      <div className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${config.color}15` }}>
              <Icon className="h-5 w-5" style={{ color: config.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--ultra-text)' }}>{config.name}</p>
              <p className="text-[11px]" style={{ color: 'var(--ultra-text-muted)' }}>Not connected</p>
            </div>
          </div>
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-3 py-1.5 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            style={{ background: 'var(--ultra-primary)' }}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </div>
    );
  }

  // Connected - show full details
  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: 'var(--ultra-card-shadow)' }}>
      {/* Header with platform name and connected status */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${config.color}15` }}>
          <Icon className="h-4 w-4" style={{ color: config.color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold" style={{ color: 'var(--ultra-text)' }}>{config.name}</p>
            {liveStatus?.isLive && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: '#FEF2F2' }}>
                <Radio className="h-2.5 w-2.5 animate-pulse" style={{ color: '#DC2626' }} />
                <span className="text-[10px] font-bold" style={{ color: '#DC2626' }}>LIVE</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" style={{ color: '#059669' }} />
            <span className="text-[10px] font-medium" style={{ color: '#059669' }}>Connected</span>
          </div>
        </div>
      </div>

      {/* Channel Details */}
      <div className="flex items-center gap-2.5 mb-3">
        {profileImage && (
          <Image
            src={profileImage}
            alt={channelName || config.name}
            width={40}
            height={40}
            className="rounded-xl"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: 'var(--ultra-text)' }}>{channelName}</p>
          {channelUrl && (
            <a 
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] flex items-center gap-1 mt-0.5"
              style={{ color: 'var(--ultra-primary)' }}
            >
              View Channel
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {/* Live Stream Info */}
      {liveStatus?.isLive && (
        <div className="mb-3 p-2.5 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <div className="flex items-start gap-2.5">
            {liveStatus.thumbnail && (
              <Image
                src={liveStatus.thumbnail}
                alt="Stream thumbnail"
                width={72}
                height={40}
                className="rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold line-clamp-2 mb-0.5" style={{ color: 'var(--ultra-text)' }}>
                {liveStatus.title}
              </p>
              {liveStatus.viewerCount !== undefined && (
                <p className="text-[10px] mb-0.5" style={{ color: 'var(--ultra-text-secondary)' }}>
                  {liveStatus.viewerCount.toLocaleString()} viewers
                </p>
              )}
              {liveStatus.gameName && (
                <p className="text-[10px] mb-1" style={{ color: 'var(--ultra-text-secondary)' }}>
                  {liveStatus.gameName}
                </p>
              )}
              <a
                href={liveStatus.streamUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-semibold"
                style={{ color: '#DC2626' }}
              >
                Watch Stream
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {config.statValue !== undefined && (
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3" style={{ background: 'var(--ultra-bg)' }}>
          <Users className="h-4 w-4" style={{ color: 'var(--ultra-text-muted)' }} />
          <div>
            <p className="text-[10px] font-medium" style={{ color: 'var(--ultra-text-muted)' }}>{config.statLabel}</p>
            <p className="text-sm font-bold" style={{ color: 'var(--ultra-text)' }}>
              {config.statValue.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Disconnect Button */}
      <button 
        onClick={handleDisconnect}
        disabled={disconnectMutation.isPending}
        className="w-full px-3 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
        style={{ background: '#FEF2F2', color: '#DC2626' }}
      >
        {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect Account'}
      </button>
    </div>
  );
}
