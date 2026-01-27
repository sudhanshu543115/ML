"use client";

import { useEffect, useState } from "react";
import Navbar from "@/src/layout/Navbar";
import { NotificationProvider, useNotifications } from "@/src/context/NotificationContext";
import Toast from "@/src/components/Toast";
import api from "@/api/axios";

interface User {
  id: string;
  name: string;
}

interface Notification {
  _id: string;
  isRead: boolean;
}

function NavbarWithNotifications() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { notifications, setNotifications } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      
      // Listen for real-time notification updates
      const handleNotificationUpdate = (event: any) => {
        setUnreadCount(event.detail.unreadCount);
      };
      
      window.addEventListener('notificationUpdate', handleNotificationUpdate);
      
      return () => {
        window.removeEventListener('notificationUpdate', handleNotificationUpdate);
      };
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications");
      const unreadNotifications = res.data.notifications?.filter((n: Notification) => !n.isRead) || [];
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev: any[]) => prev.filter((n: any) => n._id !== notificationId));
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} unreadCount={unreadCount} />
      {notifications.map((notification) => (
        <Toast
          key={notification._id}
          message={`${notification.fromUser.name} wants to connect with you!`}
          type="info"
          onClose={() => removeNotification(notification._id)}
        />
      ))}
    </>
  );
}

export default function NavbarWrapper() {
  return (
    <NotificationProvider>
      <NavbarWithNotifications />
    </NotificationProvider>
  );
}
