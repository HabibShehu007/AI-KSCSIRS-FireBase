// src/utils/uploadMedia.ts
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Upload multiple files as Base64 strings into Firestore.
 * @param files - FileList from input
 * @param complaintId - Firestore complaint doc ID
 * @returns Array of Base64 strings
 */
export async function uploadFiles(
  files: FileList,
  complaintId: string
): Promise<string[]> {
  const urls: string[] = [];

  for (const file of Array.from(files)) {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
    reader.readAsDataURL(file);
    const base64 = await base64Promise;
    urls.push(base64);
  }

  // ✅ Save Base64 strings directly in Firestore
  await updateDoc(doc(db, "complaints", complaintId), {
    files: urls,
  });

  return urls;
}

/**
 * Upload a voice note blob as Base64 string into Firestore.
 * @param blob - Recorded audio blob
 * @param complaintId - Firestore complaint doc ID
 * @returns Base64 string
 */
export async function uploadVoice(
  blob: Blob,
  complaintId: string
): Promise<string> {
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
  reader.readAsDataURL(blob);
  const base64 = await base64Promise;

  // ✅ Save Base64 audio directly in Firestore
  await updateDoc(doc(db, "complaints", complaintId), {
    voiceNote: base64,
  });

  return base64;
}
