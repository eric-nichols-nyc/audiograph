"use client"

import React, { useState } from "react"
import { AdminNavbar } from "./admin-navbar"
import { AdminSidebar } from "./admin-sidebar"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function AdminLayout({ title, children, className }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col h-full w-full overflow-hidden">
        <AdminNavbar
          title={title || ""}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
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
  )
}
