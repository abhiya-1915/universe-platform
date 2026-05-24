"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationsMenu() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || user.role === "USER") return; // Only fetch for DSA/ADMIN

    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/notifications");
        if (data.success) {
          setNotifications(data.data);
          setUnreadCount(data.data.filter((n: any) => !n.isRead).length);
        }
      } catch (error) {
        console.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unreadCount > 0) {
      // Mark as read
      try {
        await api.post("/notifications/read");
        setUnreadCount(0);
      } catch (error) {
        console.error("Failed to mark notifications as read");
      }
    }
  };

  if (!user || user.role === "USER") return null;

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative text-neutral-400 hover:text-yellow-400" 
        onClick={handleOpen}
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-neutral-900" />
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
              <h3 className="font-semibold text-neutral-100">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 border-b border-neutral-800 text-sm transition-colors ${notif.isRead ? 'bg-neutral-900 text-neutral-400' : 'bg-neutral-800/50 text-neutral-200'}`}
                  >
                    <p>{notif.content}</p>
                    <span className="text-xs text-neutral-500 mt-2 block">
                      {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
