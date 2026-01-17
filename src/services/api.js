import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { 
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
  timeout: 10000, // Add timeout to prevent hanging requests
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Ensure response has expected structure
    if (!response.data) {
      console.warn('API response missing data property');
      return { ...response, data: {} };
    }
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // Enhanced error handling
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      console.error('Network error - check if backend is running on http://localhost:3000');
      return Promise.reject(new Error('Network connection failed. Please check if the server is running on http://localhost:3000'));
    }
    
    // Don't auto-redirect on 401 - let components handle it
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - Token may be expired');
      // Only redirect if we're not already on login page
      if (!window.location.pathname.includes('/login')) {
        console.log('Redirecting to login due to 401');
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        // Use setTimeout to prevent immediate redirect during API calls
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
    }
    
    // Log CORS errors specifically
    if (error.message?.includes('CORS')) {
      console.error('CORS Error: Backend needs to allow origin http://localhost:5174');
    }
    
    return Promise.reject(error);
  }
);

export default api;
