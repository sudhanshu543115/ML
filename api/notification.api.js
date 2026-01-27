import api from "../api/axios"; 

export const clearAllNotifications = async () => {
  const response = await api.delete("/notifications/clear");
  return response.data;
};

export const getConnectionRequests = async () => {
  const res = await api.get("/connect/requests");
  return res.data;
};

export const acceptRequest = async (requestId) => {
  const res = await api.post("/connect/accept", { requestId });
  return res.data;
};

export const rejectRequest = async (requestId, reason = "") => {
  const res = await api.post("/connect/reject", { requestId, reason });
  return res.data;
};


export default {
  clearAllNotifications,
  getConnectionRequests,
  acceptRequest,
  rejectRequest
};
