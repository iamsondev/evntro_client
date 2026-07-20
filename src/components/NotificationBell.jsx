import React, { useState, useEffect, useRef } from "react";
import { Bell, Trash2, CheckCheck, Loader2, Inbox, AlertCircle, X } from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/api/notification.api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const formatDate = (dateString) => {
  const d = new Date(dateString);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const NotificationBell = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Don't render/poll if user is not logged in
  if (!user) return null;

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(typeof data.count === "number" ? data.count : 0);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  // Fetch all notifications (usually called when opening dropdown)
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      const list = Array.isArray(data) ? data : data?.notifications || [];
      setNotifications(list);
      // Re-sync unread count based on list
      const unread = list.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Poll for unread count every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id, currentReadStatus) => {
    if (currentReadStatus) return; // already read
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (e, id, wasUnread) => {
    e.stopPropagation(); // prevent triggering mark-as-read click event
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Failed to delete notification:", err);
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    try {
      await clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared");
    } catch (err) {
      console.error("Failed to clear notifications:", err);
      toast.error("Failed to clear notifications");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-foreground/80 hover:text-primary hover:bg-secondary/40 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? "animate-swing" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/80 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List Area */}
          <div className="overflow-y-auto divide-y divide-border/50 flex-1">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-xs">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 px-4 flex flex-col items-center justify-center text-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary/75">
                  <Inbox className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">All caught up! 🎉</p>
                  <p className="text-xs text-muted-foreground max-w-[200px] mt-1 mx-auto leading-relaxed">
                    No new notifications here at the moment.
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id, n.read)}
                  className={`group relative p-4 transition-colors flex gap-3 text-left cursor-pointer ${
                    n.read
                      ? "bg-transparent hover:bg-muted/15"
                      : "bg-primary/5 hover:bg-primary/8 border-l-2 border-primary"
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-6">
                    <p className={`text-xs sm:text-sm text-foreground leading-relaxed break-words ${!n.read ? "font-bold" : "font-normal text-foreground/80"}`}>
                      {n.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground block mt-1.5">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>

                  {/* Individual Delete Button on Hover */}
                  <button
                    onClick={(e) => handleDelete(e, n._id, !n.read)}
                    className="absolute right-3.5 top-3.5 h-6 w-6 rounded-md bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-destructive hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    title="Delete Notification"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 bg-muted/20 border-t border-border/80 text-center shrink-0">
              <button
                onClick={handleClearAll}
                className="w-full py-1.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-destructive font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
