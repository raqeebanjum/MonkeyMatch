import { io } from "socket.io-client";

// Initialize Socket.IO
const socket = io("http://localhost:4000");

// Listen for backend events
socket.on("connect", () => {
  console.log("Connected to backend:", socket.id);
});

socket.on("progress", (data) => {
  console.log("Progress update:", data);
});

socket.on("stopped", (data) => {
  console.log("Stopped:", data);
});

export { socket };