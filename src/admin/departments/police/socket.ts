import { socket } from "../../../socket";
import type { Complaint } from "./types";

export function joinPoliceRoom(onReceive: (incoming: Complaint) => void) {
  console.log("🔌 Joining Police room via socket");
  socket.emit("joinDepartment", "police"); // ✅ now references police

  const handler = (complaint: Complaint) => {
    console.log("📥 New Police complaint received:", complaint);
    onReceive(complaint);
  };

  socket.on("receiveComplaint", handler);

  return () => {
    console.log("🧹 Leaving Police room and cleaning up listener");
    socket.off("receiveComplaint", handler);
  };
}
