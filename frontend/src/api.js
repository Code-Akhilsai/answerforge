import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
  baseURL: backend_url ? `${backend_url}/api/v1` : "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
