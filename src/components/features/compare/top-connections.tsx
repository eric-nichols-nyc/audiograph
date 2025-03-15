'use client';

import { Card } from "@/components/ui/card";

export function TopConnections() {
  return (
    <Card className="p-6 bg-card/50 border-white/10">
      <div className="grid grid-cols-2 gap-6 text-center">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-blue-200/80">Artist One Connections</h3>
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-blue-200/80">Artist Two Connections</h3>
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </div>
      </div>
    </Card>
  );
} 