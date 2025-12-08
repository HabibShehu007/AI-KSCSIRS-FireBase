// src/types/StaffTypes.ts

export interface Staff {
  id: number;
  department_email: string;
  staff_email: string;
  password: string;
  department: string;
  createdAt: string;
}

// ✅ separate type for form state
export interface StaffFormData {
  department_email: string;
  staff_email: string;
  password: string;
  department: string;
}
