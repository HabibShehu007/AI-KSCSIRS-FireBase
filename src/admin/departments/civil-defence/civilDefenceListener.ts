// src/admin/departments/civildefence/civilDefenceListener.ts
import type { Complaint } from "../../../users/message/firebaseStorage"; // ✅ use the new Complaint type
import { listenToComplaints } from "../../../users/message/firebaseListener"; // ✅ Firestore listener

export function joinCivilDefenceRoom(
  onReceive: (incoming: Complaint[]) => void
) {
  console.log("📡 Listening to Civil Defence complaints via Firestore");

  // Subscribe to complaints where department = "civildefence"
  const unsubscribe = listenToComplaints("civildefence", (complaints) => {
    console.log("📥 Civil Defence complaints updated:", complaints);
    onReceive(complaints);
  });

  // Return cleanup function
  return () => {
    console.log("🧹 Stopped listening to Civil Defence complaints");
    unsubscribe();
  };
}
