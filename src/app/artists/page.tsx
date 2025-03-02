
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ArtistsPage() {
  // Mock data for artists
  const artists = [
    { id: 1, name: 'Taylor Swift', genre: 'Pop', followers: '87.5M', monthlyListeners: '82.3M' },
    { id: 2, name: 'Drake', genre: 'Hip-Hop', followers: '65.2M', monthlyListeners: '68.7M' },
    { id: 3, name: 'The Weeknd', genre: 'R&B', followers: '52.1M', monthlyListeners: '74.2M' },
    { id: 4, name: 'Billie Eilish', genre: 'Pop', followers: '48.7M', monthlyListeners: '56.9M' },
    { id: 5, name: 'Bad Bunny', genre: 'Reggaeton', followers: '44.3M', monthlyListeners: '59.8M' },
    { id: 6, name: 'Ariana Grande', genre: 'Pop', followers: '51.9M', monthlyListeners: '61.2M' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AudioGPraph</h1>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/sign-in">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Top Artists</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button variant="outline" size="sm">Sort</Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <div 
              key={artist.id} 
              className="rounded-lg border bg-card p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col gap-4">
                <div className="h-40 rounded-md bg-secondary/30 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary/40">{artist.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{artist.name}</h3>
                  <p className="text-sm text-muted-foreground">{artist.genre}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Followers</p>
                    <p className="font-medium">{artist.followers}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Listeners</p>
                    <p className="font-medium">{artist.monthlyListeners}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View Analytics</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AudioGPraph. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
