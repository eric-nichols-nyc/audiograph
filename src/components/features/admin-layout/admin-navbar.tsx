"use client"

import React from "react"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AdminNavbarProps {
  title: string
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function AdminNavbar({ 
  title, 
  sidebarOpen, 
  setSidebarOpen 
}: AdminNavbarProps) {
  return (
    <header className="bg-background border-b h-16 flex items-center px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-secondary"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {/* Add user profile, notifications, etc. here */}
      </div>
    </header>
  )
}
