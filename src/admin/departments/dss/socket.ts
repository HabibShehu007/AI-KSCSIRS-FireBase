import { socket } from "../../../socket";
import type { Complaint } from "./types";

export function joinDssRoom(onReceive: (incoming: Complaint) => void) {
  console.log("🔌 Joining DSS room via socket");
  socket.emit("joinDepartment", "dss"); // ✅ FIXED

  const handler = (complaint: Complaint) => {
    console.log("📥 New DSS complaint received:", complaint);
    onReceive(complaint);
  };

  socket.on("receiveComplaint", handler);

  return () => {
    console.log("🧹 Leaving DSS room and cleaning up listener");
    socket.off("receiveComplaint", handler);
  };
}
