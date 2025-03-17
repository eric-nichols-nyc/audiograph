import type React from "react"
import Image from "next/image"
import { Users } from "lucide-react"

interface PlatformIconProps {
  platform: string
  className?: string
}

export function PlatformIcon({ platform, className = "h-8 w-8" }: PlatformIconProps) {
  // Add null check for platform
  const platformKey = platform?.toLowerCase() || "default"

  // Map platform names to their colors and image paths
  const platformConfig: Record<string, { color: string; path: string }> = {
    amazon: {
      color: "#FF9900",
      path: "/images/icons/platforms/amazon.svg"
    },
    deezer: {
      color: "#FF0092",
      path: "/images/icons/platforms/deezer.svg"
    },
    facebook: {
      color: "#1877F2",
      path: "/images/icons/platforms/facebook.svg"
    },
    genius: {
      color: "#FFFFFF",
      path: "/images/icons/platforms/genius.svg"
    },
    instagram: {
      color: "#E1306C",
      path: "/icons/platforms/instagram.svg"
    },
    jiosaavn: {
      color: "#2BC5B4",
      path: "/icons/platforms/jiosaavn.svg"
    },
    linemusic: {
      color: "#00B900",
      path: "/icons/platforms/linemusic.svg"
    },
    musicbrainz: {
      color: "#00CD3C",
      path: "/images/icons/platforms/musicbrainz.svg"
    },
    qqmusic: {
      color: "#FFC028",
      path: "/icons/platforms/qqmusic.svg"
    },
    songkick: {
      color: "#F80046",
      path: "/icons/platforms/songkick.svg"
    },
    soundcloud: {
      color: "#FF7700",
      path: "/icons/platforms/soundcloud.svg"
    },
    spotify: {
      color: "#1DB954",
      path: "/images/icons/platforms/spotify.svg"
    },
    tiktok: {
      color: "#FFFFFF",
      path: "/images/icons/platforms/tiktok.svg"
    },
    triller: {
      color: "#FF0050",
      path: "/icons/platforms/triller.svg"
    },
    twitter: {
      color: "#1DA1F2",
      path: "/icons/platforms/twitter.svg"
    },
    yandex: {
      color: "#FFCC00",
      path: "/icons/platforms/yandex.svg"
    },
    youtube: {
      color: "#FF0000",
      path: "/images/icons/platforms/youtube.svg"
    }
  }

  const config = platformConfig[platformKey]

  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#243050]">
      {config ? (
        <Image
          src={config.path}
          alt={`${platformKey} icon`}
          width={24}
          height={24}
          className={className}
          style={{ color: config.color }}
        />
      ) : (
        <div className="text-gray-400">
          <Users className={className} />
        </div>
      )}
    </div>
  )
}

