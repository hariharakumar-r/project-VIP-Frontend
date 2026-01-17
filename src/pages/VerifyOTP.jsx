import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await verifyOTP(email, otp);
      const routes = {
        SUPER_ADMIN: "/admin/dashboard",
        COMPANY: "/company/dashboard",
        APPLICANT: "/applicant/dashboard",
      };
      navigate(routes[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1F1C18] to-[#8E0E00] py-12 px-4">
      <div className="max-w-md w-full bg-black rounded-xl shadow-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">Verify OTP</h2>
        <p className="text-center text-gray-400 mb-8">Enter the OTP sent to {email}</p>
        {error && <div className="bg-red-900/20 text-red-300 p-3 rounded mb-4 border border-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
