"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  BarChart,
  FileText,
  Music,
  Search,
  ChevronLeft,
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
interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  sidebarOpen: boolean;
}

function SidebarItem({
  href,
  icon,
  title,
  active,
  sidebarOpen,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-secondary text-secondary-foreground"
          : "hover:bg-secondary/50",
        !sidebarOpen && "justify-center px-0"
      )}
    >
      {icon}
      {sidebarOpen && <span>{title}</span>}
    </Link>
  );
}

interface AdminSidebarProps {
  open: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // console.log('admin sidebar: ', user)

  // Use useCallback for event handlers to maintain stable references
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] pt-4">
      <aside
        className={cn(
          "h-full overflow-y-auto transition-all duration-300 border-r",
          open
            ? "w-64 bg-blue-50/50 dark:bg-blue-950/30"
            : "w-16 bg-blue-50 dark:bg-blue-950"
        )}
      >
        <Button
          className={cn(
            "w-full text-2xl font-bold",
            open ? "justify-start" : "justify-center px-0"
          )}
          variant="ghost"
        >
          <div className={cn("flex items-center", open ? "gap-4" : "")}>
            <div>🎧</div>
            {open && <div>Audiograph</div>}
          </div>
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "w-full",
            open ? "justify-start" : "justify-center px-0"
          )}
          asChild
        >
          <Link href="/search">
            <Search className="h-5 w-5" />
            {open && <span className="ml-3">Search</span>}
          </Link>
        </Button>
        <div className={cn("space-y-4", open ? "px-4" : "px-0")}>
          {open ? (
            <Accordion type="single" collapsible className="border-none">
              <AccordionItem value="discover" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <span>Discover</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-7 space-y-1">
                    <SidebarItem
                      href="/artists"
                      icon={<Users className="h-5 w-5" />}
                      title="Artists"
                      active={pathname === "/artists"}
                      sidebarOpen={open}
                    />
                    <SidebarItem
                      href="/tracks"
                      icon={<Music className="h-5 w-5" />}
                      title="Tracks"
                      active={pathname === "/tracks"}
                      sidebarOpen={open}
                    />
                    <SidebarItem
                      href="/videos"
                      icon={<FileText className="h-5 w-5" />}
                      title="Videos"
                      active={pathname === "/videos"}
                      sidebarOpen={open}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="flex justify-center">
              <Link href="/discover" className="p-2">
                <Compass className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
        <div className={cn("space-y-4", open ? "px-4" : "px-0")}>
          {open ? (
            <Accordion type="single" defaultValue="tools" collapsible>
              <AccordionItem value="tools">
                <AccordionContent>
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span>Tools</span>
                    </div>
                  </AccordionTrigger>
                  <div className="flex flex-col gap-1">
                    <SidebarItem
                      href="/compare"
                      icon={<Users className="h-5 w-5" />}
                      title="Compare"
                      active={pathname === "/compare"}
                      sidebarOpen={open}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="flex justify-center">
              <Link href="/compare" className="p-2">
                <BarChart className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </aside>

      {onClose && (
        <Button
          onClick={handleClose}
          className="h-6 w-4 absolute -right-3 top-10 -translate-y-1/2 flex items-center justify-center bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-r-md z-50"
          aria-label="Close sidebar"
          variant="ghost"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
