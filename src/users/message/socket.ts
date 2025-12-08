// src/message/socket.ts
import { io } from "socket.io-client";

export const socket = io("http://10.0.1.132:3000", {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ User socket connected:", socket.id); // Debug log
});

socket.on("disconnect", () => {
  console.log("⚠️ User socket disconnected"); // Debug log
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message); // Debug log
});
