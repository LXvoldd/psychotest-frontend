import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

console.log("🌐 [Public API] Mengirim ke:", BASE_URL);

const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default publicApi;