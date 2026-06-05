// services/api.js
import axios from 'axios';

// Emulador Android Studio → 10.0.2.2
// para desktop 'http://ipv4:3000';
const BASE_URL = 'http://10.0.2.2:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`[API] → ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API] ← ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.log(`[API] ✗ ${error.response.status} ${error.config.url}`);
    } else if (error.request) {
      console.log('[API] ✗ Sem resposta do servidor');
    } else {
      console.log('[API] ✗ Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;