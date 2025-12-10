// src/types/StaffTypes.ts

// ✅ Firestore-compatible Staff type
export interface Staff {
  id: string; // Firestore doc IDs are strings
  department_email: string;
  staff_email: string;
  password?: string; // optional, since you may not store plain passwords
  department: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  }; // Firestore timestamp
}

// ✅ Separate type for form state (no id/createdAt)
export interface StaffFormData {
  department_email: string;
  staff_email: string;
  password: string;
  department: string;
}
