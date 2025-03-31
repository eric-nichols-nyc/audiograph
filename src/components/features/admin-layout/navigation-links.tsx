import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  BarChart,
  FileText,
  Music,
  Search,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface NavigationItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  showLabels?: boolean;
}

function NavigationItem({
  href,
  icon,
  title,
  active,
  showLabels = true,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-secondary text-secondary-foreground"
          : "hover:bg-secondary/50",
        !showLabels && "justify-center px-0"
      )}
    >
      {icon}
      {showLabels && <span>{title}</span>}
    </Link>
  );
}

interface NavigationLinksProps {
  showLabels?: boolean;
  className?: string;
}

export function NavigationLinks({
  showLabels = true,
  className,
}: NavigationLinksProps) {
  const pathname = usePathname();

  return (
    <div className={cn("space-y-4", className)}>
      <Link href="/search">
        <div
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary/50",
            !showLabels && "justify-center px-0"
          )}
        >
          <Search className="h-5 w-5" />
          {showLabels && <span>Search</span>}
        </div>
      </Link>

      {showLabels ? (
        <Accordion type="single" collapsible className="border-none">
          <AccordionItem value="discover" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <div className="flex items-center gap-3">
                <span>Discover</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-7 space-y-1">
                <NavigationItem
                  href="/artists"
                  icon={<Users className="h-5 w-5" />}
                  title="Artists"
                  active={pathname === "/artists"}
                  showLabels={showLabels}
                />
                <NavigationItem
                  href="/tracks"
                  icon={<Music className="h-5 w-5" />}
                  title="Tracks"
                  active={pathname === "/tracks"}
                  showLabels={showLabels}
                />
                <NavigationItem
                  href="/videos"
                  icon={<FileText className="h-5 w-5" />}
                  title="Videos"
                  active={pathname === "/videos"}
                  showLabels={showLabels}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <Link href="/discover" className="flex justify-center py-2">
          <Compass className="h-5 w-5" />
        </Link>
      )}

      <Accordion
        type="single"
        defaultValue="tools"
        className={cn(!showLabels && "px-0")}
      >
        <AccordionItem value="tools">
          <AccordionTrigger
            className={cn(
              showLabels ? "px-3" : "justify-center px-0",
              "min-h-[40px]"
            )}
          >
            {showLabels ? "Tools" : <BarChart className="h-5 w-5" />}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-1 px-2">
              <Button>
                <Link href="/compare">Compare Artists</Link>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
