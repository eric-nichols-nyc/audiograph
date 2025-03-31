"use client";

import { useInitResponsive } from "@/hooks/use-responsive-store";

export function ResponsiveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useInitResponsive();

  return <>{children}</>;
}
