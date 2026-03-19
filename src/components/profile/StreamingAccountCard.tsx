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
      <div className="rounded-2xl border border-white/5 bg-white/[0.04] backdrop-blur-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${config.color}20` }}>
              <Icon className="h-5 w-5" style={{ color: config.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{config.name}</p>
              <p className="text-[11px] text-white/40">Not connected</p>
            </div>
          </div>
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ background: config.color, color: 'white' }}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </div>
    );
  }

  // Connected - show full details
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.04] backdrop-blur-xl p-4">
      {/* Header with platform name and connected status */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${config.color}20` }}>
          <Icon className="h-4 w-4" style={{ color: config.color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{config.name}</p>
            {liveStatus?.isLive && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,107,107,0.15)' }}>
                <Radio className="h-2.5 w-2.5 animate-pulse text-[#FF6B6B]" />
                <span className="text-[10px] font-bold text-[#FF6B6B]">LIVE</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <CheckCircle className="h-3 w-3 text-[#00FFB2]" />
            <span className="text-[10px] font-semibold text-[#00FFB2]">Connected</span>
          </div>
        </div>
      </div>

      {/* Channel Details */}
      <div className="flex items-center gap-3 mb-3">
        {profileImage && (
          <Image
            src={profileImage}
            alt={channelName || config.name}
            width={44}
            height={44}
            className="rounded-xl border border-white/10"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate text-white">{channelName}</p>
          {channelUrl && (
            <a 
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] flex items-center gap-1 mt-1 text-white/60 hover:text-white/80 transition-colors"
            >
              View Channel
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {/* Live Stream Info */}
      {liveStatus?.isLive && (
        <div className="mb-3 p-3 rounded-xl border" style={{ background: 'rgba(255,107,107,0.08)', borderColor: 'rgba(255,107,107,0.2)' }}>
          <div className="flex items-start gap-3">
            {liveStatus.thumbnail && (
              <Image
                src={liveStatus.thumbnail}
                alt="Stream thumbnail"
                width={80}
                height={45}
                className="rounded-lg object-cover border border-white/10"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold line-clamp-2 mb-1 text-white">
                {liveStatus.title}
              </p>
              {liveStatus.viewerCount !== undefined && (
                <p className="text-[10px] mb-0.5 text-white/60">
                  {liveStatus.viewerCount.toLocaleString()} viewers
                </p>
              )}
              {liveStatus.gameName && (
                <p className="text-[10px] mb-1.5 text-white/60">
                  {liveStatus.gameName}
                </p>
              )}
              <a
                href={liveStatus.streamUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF6B6B] hover:text-[#FF6B6B]/80 transition-colors"
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
        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 mb-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <Users className="h-4 w-4 text-white/40" />
          <div>
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">{config.statLabel}</p>
            <p className="text-sm font-bold text-white">
              {config.statValue.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Disconnect Button */}
      <button 
        onClick={handleDisconnect}
        disabled={disconnectMutation.isPending}
        className="w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50 border border-[#FF6B6B]/20"
        style={{ background: 'rgba(255,107,107,0.08)', color: '#FF6B6B' }}
      >
        {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect Account'}
      </button>
    </div>
  );
}
