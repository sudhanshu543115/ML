"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import socket from "@/src/lib/socket";
import api from "@/api/axios";

interface Notification {
  _id: string;
  type: string;
  fromUser: {
    _id: string;
    name: string;
  };
  message: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Update unread count in localStorage for navbar
    const currentCount = parseInt(localStorage.getItem('unreadCount') || '0');
    const newCount = currentCount + 1;
    localStorage.setItem('unreadCount', newCount.toString());
    
    // Trigger custom event to update navbar
    window.dispatchEvent(new CustomEvent('notificationUpdate', { 
      detail: { unreadCount: newCount } 
    }));
  };

  const clearNotifications = () => {
    setNotifications([]);
    
    // Reset unread count
    localStorage.setItem('unreadCount', '0');
    
    // Trigger update to navbar
    window.dispatchEvent(new CustomEvent('notificationUpdate', { 
      detail: { unreadCount: 0 } 
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("Token exists:", !!token);
    
    if (token) {
      console.log("Connecting socket...");
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected with ID:", socket.id);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User from localStorage:", user);
        console.log("User keys:", Object.keys(user));
        console.log("User.id:", user.id);
        console.log("User._id:", user._id);
        
        // Try both id and _id
        const userId = user.id || user._id;
        if (userId) {
          console.log("Emitting user-online for:", userId);
          socket.emit("user-online", userId);
          
          // Add confirmation that event was sent
          setTimeout(() => {
            console.log("user-online event sent 2 seconds ago");
          }, 2000);
        } else {
          console.error("No user ID found in localStorage");
          console.error("Please log out and log back in to fix user object");
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.on("notification", (notification: Notification) => {
        console.log("Received notification:", notification);
        addNotification(notification);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => {
        socket.disconnect();
      };
    } else {
      console.log("No token found, not connecting socket");
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
