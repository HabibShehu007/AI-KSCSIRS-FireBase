// src/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: false, // set to true if using cookies
});

export default API;
