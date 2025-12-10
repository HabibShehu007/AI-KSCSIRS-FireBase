// src/types/UserTypes.ts

// ✅ Firestore-compatible User type
export interface User {
  id: string; // Firestore doc IDs are strings
  name: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  lga: string;
  terms_accepted: boolean; // Firestore stores true/false
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  }; // Firestore timestamp
}

// ✅ Separate type for form state (no id/createdAt)
export interface UserFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  lga: string;
  terms_accepted: boolean;
}
