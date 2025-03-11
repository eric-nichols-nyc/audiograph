"use client"

//import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/supabase/auth/client";
import { User } from "@/types/user"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function UserProfile() {
    const [mounted, setMounted] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setMounted(true)
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

    // Prevent hydration mismatch by not rendering anything until client-side
    if (!mounted) {
        return <div className="h-5 w-5" />
    }

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
