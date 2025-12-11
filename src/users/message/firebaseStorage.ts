// src/message/firebaseStorage.ts

import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

// Define the shape of a complaint
export type Complaint = {
  id: string;
  user?: string; // normalized from userName
  email?: string; // normalized from userEmail
  phone?: string; // normalized from userPhone
  subject?: string;
  message?: string;
  address?: string;
  timestamp?: Timestamp | Date | number | string;
  status: "Pending" | "Investigating" | "Resolved";
  department: string;
  files?: string[];
  voiceNote?: string;
  reply?: string;
};

// Save a complaint to Firestore under the department collection
export async function saveComplaint(
  department: string,
  data: Complaint
): Promise<void> {
  await addDoc(collection(db, "complaints"), {
    ...data,
    department,
    // ✅ Save as Firestore Timestamp
    timestamp: Timestamp.now(),
  });
}

// Retrieve all complaints for a department
export async function getComplaints(department: string): Promise<Complaint[]> {
  const q = query(
    collection(db, "complaints"),
    where("department", "==", department)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      // ✅ Normalize Firestore fields to match Complaint type
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
}
