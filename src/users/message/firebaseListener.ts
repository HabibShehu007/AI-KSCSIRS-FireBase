// src/message/firebaseListener.ts
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import type { Complaint } from "./firebaseStorage"; // 👈 import your Complaint type

/**
 * Listen to complaints in real-time.
 * @param department optional department filter
 * @param callback function to handle incoming complaints
 */
export const listenToComplaints = (
  department?: string,
  callback?: (complaints: Complaint[]) => void
) => {
  // ✅ Build query
  let q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
  if (department) {
    q = query(
      collection(db, "complaints"),
      where("department", "==", department),
      orderBy("createdAt", "desc")
    );
  }

  // ✅ Attach listener
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const complaints: Complaint[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        user: data.userName || data.user || "Unknown",
        email: data.userEmail || data.email || "",
        phone: data.userPhone || data.phone || "",
        subject: data.subject,
        message: data.message,
        address: data.address,
        timestamp: data.timestamp || data.createdAt,
        status: data.status,
        department: data.department,
        files: data.files || [],
        voiceNote: data.voiceNote,
        reply: data.reply,
      } as Complaint;
    });

    console.log("📡 Complaints updated:", complaints);

    if (callback) {
      callback(complaints);
    }
  });

  // ✅ Return unsubscribe function for cleanup
  return unsubscribe;
};
