import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      const routes = {
        SUPER_ADMIN: "/admin/dashboard",
        COMPANY: "/company/dashboard",
        APPLICANT: "/applicant/dashboard",
      };
      navigate(routes[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1F1C18] to-[#8E0E00] py-12 px-4">
      <div className="max-w-md w-full bg-black rounded-xl shadow-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Login</h2>
        {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4 border border-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 disabled:opacity-50 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-400">
          Don't have an account? <Link to="/register" className="text-red-400 font-semibold hover:text-red-300">Register</Link>
        </p>
      </div>
    </div>
  );
}
