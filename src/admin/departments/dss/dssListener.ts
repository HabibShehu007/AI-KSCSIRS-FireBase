// src/admin/departments/dss/dssListener.ts
import { listenToComplaints } from "../../../users/message/firebaseListener";
import type { Complaint } from "../../../users/message/firebaseStorage";

export function joinDssRoom(onReceive: (incoming: Complaint[]) => void) {
  console.log("📡 Listening to DSS complaints via Firestore");

  // Subscribe to complaints where department = "dss"
  const unsubscribe = listenToComplaints("dss", (complaints) => {
    console.log("📥 DSS complaints updated:", complaints);
    onReceive(complaints);
  });

  // Return cleanup function
  return () => {
    console.log("🧹 Stopped listening to DSS complaints");
    unsubscribe();
  };
}
