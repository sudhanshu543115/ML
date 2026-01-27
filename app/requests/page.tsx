"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Check, X, Clock, ShieldAlert } from "lucide-react"; // Optional: Icons for better UX
import {
  getConnectionRequests,
  acceptRequest,
  rejectRequest,
} from "../../api/Allapi";

const RequestsPage = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getConnectionRequests();
      setRequests(res.data);
    } catch (error) {
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string, fromUserId: string) => {
    try {
      setActionLoading(id);
      await acceptRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      // Redirect to chat with the user
      router.push(`/chat?userId=${fromUserId}`);
    } catch {
      alert("Failed to accept request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string, reason: string = "") => {
    try {
      setActionLoading(id);
      await rejectRequest(id, reason);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      setShowRejectModal(false);
      setRejectReason("");
    } catch {
      alert("Failed to reject request");
    } finally {
      setActionLoading(null);
      setRejectingId(null);
    }
  };

  const openRejectModal = (id: string) => {
    setRejectingId(id);
    setShowRejectModal(true);
  };

  // Helper for UI: Get initials from name
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  if (loading) {
    return (
      <div className="flex bg-gray-50 flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl bg-gray-50 mx-auto py-10 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Connection Requests</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {requests.length} Pending
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
            <User size={48} />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No pending requests</h3>
          <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="group bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* User Info Section */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                  {getInitials(req.fromUser.name)}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {req.fromUser.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    {req.fromUser.email}
                  </p>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => openRejectModal(req._id)}
                  disabled={actionLoading === req._id}
                  className="flex-1 sm:flex-none justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex gap-2"
                >
                  <X size={16} />
                  Reject
                </button>

                <button
                  onClick={() => handleAccept(req._id, req.fromUser._id)}
                  disabled={actionLoading === req._id}
                  className="flex-1 sm:flex-none justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex gap-2"
                >
                  {actionLoading === req._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Check size={16} />
                  )}
                  {actionLoading === req._id ? "Processing" : "Accept"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Connection Request</h3>
            <p className="text-gray-600 mb-4">Would you like to provide a reason for rejecting this request?</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Optional: Add a reason..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setRejectingId(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => rejectingId && handleReject(rejectingId, rejectReason)}
                disabled={actionLoading === rejectingId}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading === rejectingId ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;