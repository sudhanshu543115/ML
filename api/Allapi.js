import api from "./axios"; 

export const clearAllNotifications = async () => {
  const response = await api.delete("/notifications/clear");
  return response.data;
};

export const getConnectionRequests = async () => {
  const res = await api.get("/connect/requests");
  return res.data;
};
//sdfghjkl

export const acceptRequest = async (requestId) => {
  const res = await api.post("/connect/accept", { requestId });
  return res.data;
};

export const rejectRequest = async (requestId, reason = "") => {
  const res = await api.post("/connect/reject", { requestId, reason });
  return res.data;
};


export const getSkills = async () => {
  const res = await api.get("/skills");
  return res.data;
};



export const getFriendsList = async () => {
  const res = await api.get("/user/friends");
  return res.data;
};

export const getChats = async () => {
  const res = await api.get("/chat");
  return res.data;
};

export const getMessages = async (chatId) => {
  const res = await api.get(`/chat/${chatId}/messages`);
  return res.data;
};

export const createChat = async (participantId) => {
  const res = await api.post("/chat", { participantId });
  return res.data;
};

export const sendMessage = async (chatId, text) => {
  const res = await api.post("/chat/send", { chatId, text });
  return res.data;
};


export default {
  clearAllNotifications,
  getConnectionRequests,
  acceptRequest,
  rejectRequest,
  getSkills,
  getFriendsList,
  getChats,
  getMessages,
  createChat,
  sendMessage
};
