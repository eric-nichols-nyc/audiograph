import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/auth/server"
import React from "react"
import { redirect } from "next/navigation"

export default async function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {

const user = await getUser ()
console.log('adminlaoyt:user',user)
if (!user) {
  throw new Error("User not found")
}
const supabase = await createClient()
  // We don't wrap the children in AdminLayout here because we want each page
  // to be able to set its own title and potentially customize the layout
    // Check if user has admin role
    const { data: account, error } = await supabase
    .from('accounts')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  if (error || account?.role !== 'admin') {
    // Redirect non-admin users
    redirect( '/artists')
  }
  
  return (
    <>
      {children}
    </>
  )
}
