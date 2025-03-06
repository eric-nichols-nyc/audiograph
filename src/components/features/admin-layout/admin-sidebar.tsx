"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart,
  FileText,
  Music,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  return (
    <div className="relative flex h-[calc(100vh-4rem)]">
      <aside
        className={cn(
          "h-full overflow-y-auto transition-all duration-300 border-r",
          open
            ? "w-64 bg-blue-50/50 dark:bg-blue-950/30"
            : "w-16 bg-blue-50 dark:bg-blue-950"
        )}
      >
        <div className={cn("space-y-4", open ? "p-4" : "p-2")}>
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            title="Dashboard"
            active={pathname === "/dashboard"}
            sidebarOpen={open}
          />

          {open ? (
            <Accordion type="single" collapsible className="border-none">
              <AccordionItem value="content" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <BarChart className="h-5 w-5" />
                    <span>Admin</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-7 space-y-1">
                    <SidebarItem
                      href="/admin/artists"
                      icon={<Users className="h-5 w-5" />}
                      title="Artists"
                      active={pathname.startsWith("/admin/artists")}
                      sidebarOpen={open}
                    />
                    <SidebarItem
                      href="/admin/tracks"
                      icon={<Music className="h-5 w-5" />}
                      title="Albums"
                      active={pathname.startsWith("/admin/tracks")}
                      sidebarOpen={open}
                    />
                       <SidebarItem
                      href="/admin/videos"
                      icon={<FileText className="h-5 w-5" />}
                      title="Videos"
                      active={pathname.startsWith("/admin/videos")}
                      sidebarOpen={open}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <Link href="/content" className="flex justify-center py-2">
              <FileText className="h-5 w-5" />
            </Link>
          )}

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
      </aside>

      {open && onClose && (
        <button
          onClick={onClose}
          className="h-12 w-6 absolute -right-6 top-1/2 -translate-y-1/2 flex items-center justify-center bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-r-md"
          aria-label="Close sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
