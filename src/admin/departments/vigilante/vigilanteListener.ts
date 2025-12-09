// src/admin/departments/vigilante/vigilanteListener.ts
import type { Complaint } from "../../../users/message/firebaseStorage"; // ✅ use the new Complaint type
import { listenToComplaints } from "../../../users/message/firebaseListener"; // ✅ Firestore listener

export function joinVigilanteRoom(onReceive: (incoming: Complaint[]) => void) {
  console.log("📡 Listening to Vigilante complaints via Firestore");

  // Subscribe to complaints where department = "vigilante"
  const unsubscribe = listenToComplaints("vigilante", (complaints) => {
    console.log("📥 Vigilante complaints updated:", complaints);
    onReceive(complaints);
  });

  // Return cleanup function
  return () => {
    console.log("🧹 Stopped listening to Vigilante complaints");
    unsubscribe();
  };
}
