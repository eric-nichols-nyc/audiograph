"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { Notifications } from "./notifications"
import { UserProfile } from "./user-profile";
import { usePathname } from "next/navigation";
import {
  Users,
  BarChart,
  FileText,
  Music,
  Search,
  ChevronLeft,
  Compass,
  LogOut
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

        <Button className="w-full justify-start text-2xl font-bold" variant="ghost">
          <div className="flex items-center gap-4">
            <div>🎧</div>
            <div>Audiograph</div>
          </div>
        </Button>
        <Link href="/search">
          <Button variant="ghost" className="w-full justify-start">
            <Search className="h-5 w-5" />
            {open && <span className="ml-3">Search</span>}
          </Button>
        </Link>
        <div className={cn("space-y-4", open ? "p-4" : "p-2")}>

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
            <Link href="/discover" className="flex justify-center py-2">
              <Compass className="h-5 w-5" />
            </Link>
          )}
        </div>

        <Accordion type="single" defaultValue="tools">
          <AccordionItem value="tools">
            <AccordionTrigger className={cn("px-3", !open && "justify-center")}>
              {open ? "Tools" : <BarChart className="h-5 w-5" />}
            </AccordionTrigger>
            <AccordionContent>
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

        <div className="mt-auto p-3 absolute bottom-0 w-full">
          <Notifications />

          <UserProfile />
          <button
            className={cn(
              "w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary",
              !open && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5" />
            {open && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {open && onClose && (
        <button
          onClick={handleClose}
          className="h-12 w-6 absolute -right-6 top-10 -translate-y-1/2 flex items-center justify-center bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-r-md z-50"
          aria-label="Close sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
