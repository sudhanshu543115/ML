"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Check, 
  X, 
  User, 
  Clock, 
  Loader2, 
  ChevronRight,
  MessageSquare,
  UserPlus,
  ShieldCheck
} from "lucide-react";
  import api from "@/api/axios";
  import { clearAllNotifications } from "@/api/Allapi";
interface Notification {
  _id: string;
  type: string;
  fromUser: {
    _id: string;
    name: string;
    email: string;
  };
  message: string;
  isRead: boolean;
  createdAt: string;
}

type NotificationType = "connection_request" | "request_accepted" | "chat";

export default function NotificationsPage(): JSX.Element {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const acceptRequest = async (id: string) => {
    try {
      await api.post("/connect/accept", { requestId: id });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      alert("Connection request accepted!");
    } catch (error: any) {
      console.error("Accept request error:", error);
      alert(error.response?.data?.message || "Failed to accept request");
    }
  };

  const rejectRequest = async () => {
    if (!rejectingId) return;

    try {
      await api.post("/connect/reject", {
        requestId: rejectingId,
        reason: rejectReason,
      });

      setNotifications((prev) =>
        prev.filter((n) => n._id !== rejectingId)
      );

      setRejectingId(null);
      setRejectReason("");
      alert("Connection request rejected!");
    } catch (error: any) {
      console.error("Reject request error:", error);
      alert(error.response?.data?.message || "Failed to reject request");
    }     
  };

  // Helper to get icon based on type (Purely visual, logic unchanged)
  const getIcon = (type: string) => {
    switch (type) {
      case "connection_request": return <UserPlus className="w-5 h-5 text-indigo-600" />;
      case "request_accepted": return <ShieldCheck className="w-5 h-5 text-green-600" />;
      case "chat": return <MessageSquare className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading updates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Bell className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          </div>
          {notifications.length > 0 && (
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {notifications.length} New
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 border rounded-lg">
        <div className="flex justify-end px-6 py-2 bg-blue-900 rounded-lg">
          <button disabled={loading} onClick={ clearAllNotifications} className="text-black bg-white px-4 py-2 rounded-lg m-3">
            {loading ? "Clearing..." : "Clear All"}
          </button>
        </div>
        {notifications.length === 0 ? (
          <div className="flex flex-col mt-5 items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No notifications yet</h3>
            <p className="text-gray-500 mt-1 max-w-sm">
              When you get connection requests or messages, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-5 flex flex-col sm:flex-row gap-5">
                  
                  {/* Icon / Avatar Column */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 border-2 border-white shadow-sm">
                        {n.fromUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                        {getIcon(n.type)}
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {n.fromUser.name}
                        </p>
                        <p className="text-gray-600 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                      <span className="flex items-center text-xs text-gray-400 whitespace-nowrap ml-4">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {/* View Profile Action */}
                      <button
                        onClick={() => router.push(`/profile/${n.fromUser._id}`)}
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        <User className="w-4 h-4 mr-1.5" />
                        View Profile
                      </button>

                      {/* Connection Actions (Only if connection_request) */}
                      {n.type === "connection_request" && (
                        <div className="flex items-center gap-2 sm:ml-auto mt-2 sm:mt-0">
                           <button
                            onClick={() => setRejectingId(n._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                          >
                            <X className="w-4 h-4 mr-1.5" />
                            Reject
                          </button>
                          <button
                            onClick={() => acceptRequest(n._id)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
                          >
                            <Check className="w-4 h-4 mr-1.5" />
                            Accept
                          </button>
                        </div>
                      )}
                      
                      {/* Quick Chat Action (Only if chat or accepted) */}
                      {(n.type === "request_accepted" || n.type === "chat") && (
                         <div className="flex items-center gap-2 sm:ml-auto mt-2 sm:mt-0">
                           <button
                            onClick={() => router.push(`/chat`)}
                            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4 mr-1.5" />
                            Reply
                            <ChevronRight className="w-3 h-3 ml-1 text-gray-400" />
                          </button>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= REJECT MODAL ================= */}
      {rejectingId && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100 transform transition-all scale-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Reject Connection
              </h2>
              <button 
                onClick={() => setRejectingId(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Are you sure? You can optionally provide a reason for the user.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none outline-none"
              rows={3}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={rejectRequest}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm transition-colors"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}