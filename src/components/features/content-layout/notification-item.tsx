"use client";

import { timeAgo } from "../../../utils/time-ago";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Notification } from "@/types/notifications";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/notifications?id=${notification.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification", error);
    }
    setDeleting(false);
  };

  return (
    <>
      <li className="flex items-center justify-between p-3 my-2 rounded-lg shadow-sm bg-[#e6f0ff] border-l-4 border-[#3b82f6] hover:shadow-md transition-all duration-200">
        <div className="flex-1">
          <h4 className="text-sm text-[#1e40af] mb-1">{notification.title}</h4>
          <p className="text-sm text-gray-700 mb-1">{notification.message}</p>
          <p className="text-xs text-gray-500 italic">{timeAgo(notification.created_at)}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="ml-3 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Delete Notification"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </li>
    </>
  );
}
