"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useFetchNotification from "@/hooks/use-fetch-notifications";
import { BellIcon } from "lucide-react";
import { NotificationItem } from "./notification-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/types/notifications";

export function Notifications() {
  const { notifications, loading } = useFetchNotification();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        {loading ? (
          <div>Loading...</div>
        ) : notifications.length > 0 ? (
          <ScrollArea className="h-[300px] w-full">
            <ul className="w-full">
              {notifications.map((notification: Notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <div>No notifications</div>
        )}
      </PopoverContent>
    </Popover>
  );
}
