"use client"

import React, { useState, useMemo, memo } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  title?: string
  children: React.ReactNode
  className?: string
}

// Memoize the sidebar component to prevent re-renders
const MemoizedSidebar = memo(AdminSidebar);


export function AdminLayout({ title, children, className }: AdminLayoutProps) {
  console.log('admin layout title', title);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Create memoized handlers to ensure stable references
  const handleCloseSidebar = useMemo(() => () => setSidebarOpen(false), []);

  // Create a memoized layout structure that won't change when children change
  const layoutStructure = useMemo(() => (
    <div className="flex h-screen">
      <MemoizedSidebar
        open={sidebarOpen}
        onClose={handleCloseSidebar}
      />
      <div className="flex flex-col h-full w-full overflow-hidden">
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  ), [sidebarOpen, handleCloseSidebar, className, children]);

  return layoutStructure;
}
