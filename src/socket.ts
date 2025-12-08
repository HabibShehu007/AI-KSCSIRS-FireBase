// src/socket.ts
import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_API_BASE;

export const socket = io(baseURL, {
  transports: ["websocket"],
  autoConnect: true,
});
