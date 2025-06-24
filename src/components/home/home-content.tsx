import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  BarChart3,
  Globe2,
  Users2,
  TrendingUp,
  Zap,
  Music,
  GitCompare,
  Activity,
  Radio,
} from "lucide-react";

export function HomeContent() {
  // Sticky header navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/artists", label: "Artists" },
    { href: "/compare", label: "Compare" },
    //{ href: "/sign-in", label: "Sign In" },
  ];

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
      title: "Artist Analytics",
      description:
        "Comprehensive performance metrics for artists across all major platforms",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: "Trend Discovery",
      description:
        "Identify emerging trends and patterns in the music industry",
    },
    {
      icon: <Users2 className="h-8 w-8 text-purple-500" />,
      title: "Audience Insights",
      description:
        "Understand audience demographics and engagement across platforms",
    },
    {
      icon: <GitCompare className="h-8 w-8 text-orange-500" />,
      title: "Artist Comparison",
      description:
        "Compare performance metrics across multiple artists and platforms to discover competitive insights",
    },
    {
      icon: <Activity className="h-8 w-8 text-red-500" />,
      title: "Real-Time Metrics",
      description:
        "Monitor streaming numbers, follower growth, and engagement metrics in real-time",
    },
    {
      icon: <Globe2 className="h-8 w-8 text-cyan-500" />,
      title: "Global Reach Analytics",
      description:
        "Visualize where your audience is streaming from with interactive maps and regional trends",
    },
    {
      icon: <Radio className="h-8 w-8 text-indigo-500" />,
      title: "Multi-Platform Tracking",
      description:
        "Track artist performance across Spotify, YouTube, Deezer, and more with unified analytics",
    },
    {
      icon: <Music className="h-8 w-8 text-pink-500" />,
      title: "Track Performance",
      description:
        "Deep dive into individual song performance with streaming counts and playlist placements",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Growth Forecasting",
      description:
        "AI-powered predictions and trend analysis to forecast artist growth and opportunities",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur border-b border-border/40 shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎧</span>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AudioGPragh
            </span>
          </Link>
          <nav className="flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 relative overflow-hidden w-full">
          {/* Background Video - Bleeding left and right */}
          <div className="absolute inset-0 w-screen h-full z-0 left-1/2 -translate-x-1/2">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-30"
            >
              <source
                src="/mp3/650353c69dde89c0fd6869c9_Nxt wav loop video 3-transcode.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Content overlay */}
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center relative z-10 mx-auto">
            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl md:text-7xl lg:text-8xl animate-pulse">
                🎧
              </span>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent p-3">
                Music Analytics Reimagined
              </h1>
            </div>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Track artist performance, discover trends, and gain insights with
              our powerful music analytics platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/artists">
                <Button variant="outline" size="lg">
                  Explore Artists
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Artist Comparison Showcase */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Compare Artists Like Never Before
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get detailed side-by-side comparisons of any two artists with
                comprehensive metrics across all platforms. Discover competitive
                insights and market positioning in seconds.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="rounded-lg overflow-hidden shadow-2xl border">
                <Image
                  src="/images/artist-comparison.png"
                  alt="Artist Comparison Interface showing Justin Bieber vs Selena Gomez with metrics like Monthly Listeners, Followers, and Popularity scores"
                  className="w-full h-auto"
                  width={1200}
                  height={400}
                  style={{
                    background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><rect width="1200" height="400" fill="%23000"/><text x="600" y="200" font-family="Arial" font-size="24" fill="%23fff" text-anchor="middle">Artist Comparison Screenshot</text></svg>') center/cover`,
                  }}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    Side-by-Side
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Compare monthly listeners, followers, and popularity scores
                    across platforms
                  </p>
                </div>
                <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    Visual Charts
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Interactive bar charts show relative performance at a glance
                  </p>
                </div>
                <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    Overall Rankings
                  </div>
                  <p className="text-sm text-muted-foreground">
                    See how artists rank globally across all tracked metrics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-6 py-8 md:py-12 lg:py-24 w-full bg-background/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything You Need for Music Analytics
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive tools and insights to understand artist
                performance, track trends, and make data-driven decisions in the
                music industry.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-muted p-2 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <Link href="/artists">
                <Button size="lg" className="px-8">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 lg:py-20 border-t">
          <div className="container mx-auto">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">5+</div>
                <div className="text-sm text-muted-foreground">
                  Platforms Tracked
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">Real-time</div>
                <div className="text-sm text-muted-foreground">
                  Data Updates
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">Global</div>
                <div className="text-sm text-muted-foreground">
                  Analytics Coverage
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  AI-Powered
                </div>
                <div className="text-sm text-muted-foreground">Insights</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0 w-full">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AudioGPraph. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
