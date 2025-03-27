"use client";

import React, { useState, useMemo, memo, useEffect } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { NavigationLinks } from "./navigation-links";
import { cn } from "@/lib/utils";
import { useWindowSize } from "react-use";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdminLayoutProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

// Memoize the sidebar component to prevent re-renders
const MemoizedSidebar = memo(AdminSidebar);

export function AdminLayout({ title, children, className }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { width } = useWindowSize();
  const shouldCollapse = width < 700; // custom collapse breakpoint

  // Automatically toggle sidebar based on window width
  useEffect(() => {
    setSidebarOpen(!shouldCollapse);
  }, [shouldCollapse]);

  // Create memoized handlers to ensure stable references
  const handleCloseSidebar = useMemo(
    () => () => setSidebarOpen(!sidebarOpen),
    [sidebarOpen]
  );

  // Create a memoized layout structure that won't change when children change
  const layoutStructure = useMemo(
    () => (
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden sm:block">
          <MemoizedSidebar open={sidebarOpen} />
        </div>

        {/* Mobile Header with Sheet */}
        <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
          <div className="flex items-center h-16 px-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <span>🎧</span>
                      <span>Audiograph</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <NavigationLinks showLabels={true} className="mt-4" />
              </SheetContent>
            </Sheet>
            <div className="flex-1 font-semibold">{title}</div>
          </div>
        </div>

        <div className="flex flex-col h-full w-full overflow-hidden">
          <main
            className={cn(
              "flex-1 overflow-y-auto transition-all duration-300",
              "sm:pt-0 pt-16", // Add padding for mobile header
              className
            )}
          >
            {children}
          </main>
        </div>
      </div>
    ),
    [sidebarOpen, handleCloseSidebar, title, className, children]
  );

  return layoutStructure;
}
