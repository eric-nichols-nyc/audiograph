"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Notifications } from "./notifications"
import { UserProfile } from "./user-profile"
import { getUser } from "@/lib/supabase/auth/client"
import { User } from "@/types/user"
//import {useAuth} from '@/hooks/use-auth';

interface AdminNavbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function AdminNavbar({
  sidebarOpen,
  setSidebarOpen
}: AdminNavbarProps) {
  const [user, setUser] = useState<User | null>(null);

  // Use useCallback for event handlers to maintain stable references
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log(user)
  }, [user]);

  return (
    <header className="bg-background border-b h-16 flex items-center px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-secondary"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Notifications />
        <UserProfile />
        <ThemeToggle />
      </div>
    </header>
  )
}
