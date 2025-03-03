"use client"

import React from "react"

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // We don't wrap the children in AdminLayout here because we want each page
  // to be able to set its own title and potentially customize the layout
  return (
    <>
      {children}
    </>
  )
}
