"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Menu, User as UserIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Notifications } from "./notifications"
import { getUser } from "@/lib/supabase/auth/client"
import { User } from "@/types/user"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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

function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return <div className="h-5 w-5 animate-pulse bg-muted rounded-full"></div>
  }

  if (!user) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-secondary p-2 rounded-md">
          <UserIcon className="h-5 w-5" />
          <span className="text-sm hidden sm:inline-block">{user.email}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-2">
          <div className="font-medium">{user.email}</div>
          <div className="text-xs text-muted-foreground">Role: {user.role}</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
