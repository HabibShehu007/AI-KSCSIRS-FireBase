// Define the shape of a complaint
export type Complaint = {
  id: number;
  user: string;
  phone?: string;
  email?: string;
  subject: string;
  message?: string;
  address?: string;
  timestamp: string;
  status: "Pending" | "Investigating" | "Resolved";
  department: string;
  files?: string[];
  voiceNote?: string;
  reply?: string;
};

// Internal helper to generate consistent localStorage key
function getStorageKey(department: string): string {
  return `complaints_${department.toLowerCase()}`;
}

// Save a complaint to localStorage under the department key
export function saveComplaint(department: string, data: Complaint): void {
  const key = getStorageKey(department);
  const existing: Complaint[] = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push(data);
  localStorage.setItem(key, JSON.stringify(existing));
}

// Retrieve all complaints for a department
export function getComplaints(department: string): Complaint[] {
  const key = getStorageKey(department);
  return JSON.parse(localStorage.getItem(key) || "[]");
}
