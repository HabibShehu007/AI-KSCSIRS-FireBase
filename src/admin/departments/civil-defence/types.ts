// src/police/types.ts
export type Complaint = {
  id: number;
  user: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  address: string;
  timestamp: string;
  status: "Pending" | "Resolved" | "Investigating";
  department: "civil-defence";
  files: string[];
  voiceNote?: string;
  reply?: string;
};
