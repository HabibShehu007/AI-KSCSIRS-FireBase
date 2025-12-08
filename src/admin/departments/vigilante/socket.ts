import { socket } from "../../../socket";
import type { Complaint } from "./types";

export function joinVigilanteRoom(onReceive: (incoming: Complaint) => void) {
  console.log("🔌 Joining Vigilante room via socket");
  socket.emit("joinDepartment", "vigilante"); // ✅ Scoped for See Watch

  const handler = (complaint: Complaint) => {
    console.log("📥 New Vigilante complaint received:", complaint);
    onReceive(complaint);
  };

  socket.on("receiveComplaint", handler);

  return () => {
    console.log("🧹 Leaving Vigilante room and cleaning up listener");
    socket.off("receiveComplaint", handler);
  };
}
