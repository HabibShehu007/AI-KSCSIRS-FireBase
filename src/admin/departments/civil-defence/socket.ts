import { socket } from "../../../socket";
import type { Complaint } from "./types";

export function joinCivilDefenceRoom(onReceive: (incoming: Complaint) => void) {
  console.log("🔌 Joining Civil Defence room via socket");
  socket.emit("joinDepartment", "civildefence"); // ✅ FIXED

  const handler = (complaint: Complaint) => {
    console.log("📥 New Civil Defence complaint received:", complaint);
    onReceive(complaint);
  };

  socket.on("receiveComplaint", handler);

  return () => {
    console.log("🧹 Leaving Civil Defence room and cleaning up listener");
    socket.off("receiveComplaint", handler);
  };
}
