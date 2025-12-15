// src/admin/departments/dss/dssListener.ts
import { listenToComplaints } from "../../../users/message/firebaseListener";
import type { Complaint } from "../../../users/message/firebaseStorage";

export function joinDssRoom(
  onReceive: (complaints: Complaint[], newest?: Complaint) => void
) {
  console.log("📡 Listening to DSS complaints via Firestore");

  let lastSeenId: string | null = null;

  const unsubscribe = listenToComplaints("dss", (complaints) => {
    // Sort complaints by timestamp (newest first)
    const sorted = [...complaints].sort(
      (a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0)
    );

    // Determine newest complaint
    const newest = sorted.length > 0 ? sorted[0] : undefined;

    // Only mark as "newest" if it's different from the last seen
    let fresh: Complaint | undefined = undefined;
    if (newest && newest.id !== lastSeenId) {
      fresh = newest;
      lastSeenId = newest.id;
    }

    console.log("📥 DSS complaints updated:", sorted);
    onReceive(sorted, fresh);
  });

  return () => {
    console.log("🧹 Stopped listening to DSS complaints");
    unsubscribe();
  };
}
