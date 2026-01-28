import { io } from "socket.io-client";

const socket = io("https://ml-backend-93ug.onrender.com", {
  withCredentials: true,
  autoConnect: true,
});

export default socket;

