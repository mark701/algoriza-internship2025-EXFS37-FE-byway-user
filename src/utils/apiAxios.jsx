// src/services/apiAxios.js
import axios from 'axios';
import { API_BASE_URL } from './ApiUrl';
import { isTokenExpired } from './TokenExpire';
const apiAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});



apiAxios.interceptors.request.use((config) => {

  const token = localStorage.getItem('token');
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (token && isTokenExpired(token)) {


    localStorage.removeItem('token');

    window.dispatchEvent(new CustomEvent('auth-token-expired'));

    window.location.href = '/login';
    alert("Your session has expired. Please login again.");


  }
  return config;
});

// Handle 401 Unauthorized responses
apiAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    var token = localStorage.getItem('token');
    if (token) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');

        // Dispatch a custom event to notify components about token removal
        window.dispatchEvent(new CustomEvent('auth-token-expired'));

        alert("Your session has expired. Please login again.");
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiAxios;
