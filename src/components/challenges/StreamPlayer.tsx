'use client';

interface StreamPlayerProps {
  platform: 'YOUTUBE' | 'TWITCH';
  url: string;
  label: string;
}

export function StreamPlayer({ platform, url, label }: StreamPlayerProps) {
  const getEmbedUrl = () => {
    if (platform === 'YOUTUBE') {
      // Convert YouTube URL to embed format
      // https://www.youtube.com/watch?v=VIDEO_ID -> https://www.youtube.com/embed/VIDEO_ID
      // https://youtu.be/VIDEO_ID -> https://www.youtube.com/embed/VIDEO_ID
      const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=0&modestbranding=1`;
      }
      return url;
    } else if (platform === 'TWITCH') {
      // Convert Twitch URL to embed format
      // https://www.twitch.tv/CHANNEL -> https://player.twitch.tv/?channel=CHANNEL&parent=domain
      const channelMatch = url.match(/twitch\.tv\/([^\/\s]+)/);
      if (channelMatch && channelMatch[1]) {
        // Use window.location.hostname for parent parameter
        const parent = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        return `https://player.twitch.tv/?channel=${channelMatch[1]}&parent=${parent}&autoplay=false`;
      }
      return url;
    }
    return url;
  };

  const embedUrl = getEmbedUrl();

  return (
    <div className="w-full">
      <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
}
