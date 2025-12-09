// src/message/firebaseStorage.ts

import { db } from "../../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Define the shape of a complaint (same as before, but id will be string from Firestore)
export type Complaint = {
  id: string; // Firestore auto-generated ID
  user: string;
  phone?: string;
  email?: string;
  subject: string;
  message?: string;
  address?: string;
  timestamp: number;
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
    timestamp: new Date().toISOString(),
  });
}

// Retrieve all complaints for a department
export async function getComplaints(department: string): Promise<Complaint[]> {
  const q = query(
    collection(db, "complaints"),
    where("department", "==", department)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Complaint),
    id: doc.id,
  }));
}
