'use client';

interface StreamEmbedProps {
  platform: 'YOUTUBE' | 'TWITCH';
  url: string;
  playerName: string;
}

export function StreamEmbed({ platform, url, playerName }: StreamEmbedProps) {
  const getEmbedUrl = () => {
    if (platform === 'YOUTUBE') {
      // Extract video ID from various YouTube URL formats
      const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=0`;
      }
    } else if (platform === 'TWITCH') {
      // Extract channel name from Twitch URL
      const channelMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
      if (channelMatch && channelMatch[1]) {
        return `https://player.twitch.tv/?channel=${channelMatch[1]}&parent=${window.location.hostname}&autoplay=true&muted=false`;
      }
    }
    return null;
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-sm mb-2">Unable to embed stream</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00FFB2] text-sm hover:underline"
          >
            Watch on {platform === 'YOUTUBE' ? 'YouTube' : 'Twitch'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={`${playerName}'s stream`}
      />
    </div>
  );
}
