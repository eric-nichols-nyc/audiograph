"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavigationLinks } from "./navigation-links";

interface AdminSidebarProps {
  open: boolean;
}

export function AdminSidebar({ open }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "h-screen bg-background border-r transition-all duration-300",
        open ? "w-[250px]" : "w-[70px]"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span>🎧</span>
              {open && <span>Audiograph</span>}
            </Link>
          </div>
        </div>
        <NavigationLinks showLabels={open} className="flex-1" />
      </div>
    </aside>
  );
}
