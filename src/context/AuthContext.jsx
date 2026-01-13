import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { checkBackendHealth, displayHealthStatus } from "../utils/healthCheck";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check backend health on startup
    const performHealthCheck = async () => {
      const healthResult = await checkBackendHealth();
      displayHealthStatus(healthResult);
    };
    
    performHealthCheck();
    
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const role = localStorage.getItem("role");
      let endpoint = "/api/applicant/profile";
      if (role === "COMPANY") endpoint = "/api/company/profile";
      else if (role === "SUPER_ADMIN") endpoint = "/api/admin/profile";
      
      const res = await api.get(endpoint);
      setUser({ ...res.data, role });
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      
      // Validate response structure
      if (!res.data || !res.data.token) {
        throw new Error('Invalid response from server - missing token');
      }
      
      const { token: newToken, user: userData } = res.data;
      
      if (!userData || !userData.role) {
        throw new Error('Invalid user data received - missing role');
      }
      
      localStorage.setItem("token", newToken);
      localStorage.setItem("role", userData.role);
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide more specific error messages
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      
      if (error.message?.includes('CORS')) {
        throw new Error('Server configuration error. Please contact support.');
      }
      
      throw error;
    }
  };

  const register = async (data) => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  };

  const verifyOTP = async (email, otp) => {
    const res = await api.post("/api/auth/verify-otp", { email, otp });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", userData.role);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
