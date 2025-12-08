export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  lga: string;
  terms_accepted: number; // or boolean if you prefer
  created_at: string;
}
