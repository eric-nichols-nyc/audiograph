'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Artist } from '@/types/artist'

interface ArtistNavProps {
  artist: Artist
}

export function ArtistNavbar({ artist }: ArtistNavProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/').slice(0, 3).join('/')
  
  const navItems = [
    { label: 'Overview', href: `${basePath}/overview` },
    { label: 'Metrics', href: `${basePath}/metrics` },
    { label: 'Videos', href: `${basePath}/videos` },
    { label: 'Songs', href: `${basePath}/songs` },
  ]

  // Get first letter of artist name for fallback
  const artistInitial = artist?.name?.charAt(0) || 'A'

  // Format genres for display
  const displayGenres = artist?.genres?.slice(0, 2).join(', ') || 'Unknown Genre'

  return (
    <div className="z-20 bg-background w-full border-b">
      <div className="flex flex-col">
        <div className="flex items-center gap-4 px-6 py-3">
          <Avatar className="w-12 h-12">
            <AvatarImage className="w-12 h-12" src={artist?.image_url || "https://github.com/shadcn.png"} />
            <AvatarFallback className="w-12 h-12">{artistInitial}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground text-lg">{artist?.name || "Artist Name"}</span>
              {artist?.rank && (
                <Badge variant="outline" className="text-xs">
                  #: {artist.rank}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {artist?.country && (
                <span>{artist.country}</span>
              )}
              {artist?.genres && artist.genres.length > 0 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span>{displayGenres}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <nav className="flex gap-6 px-6 pb-2">
          {navItems.map((item) => {
            // Check if this nav item matches the current path
            const isActive = pathname.includes(item.href.split('/').pop() || '')
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium pb-2 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
} 