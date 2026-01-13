import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackendStatus from "./components/BackendStatus";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import InfoPage from "./pages/InfoPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ApplicantDashboard from "./pages/applicant/ApplicantDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import InterviewDetails from "./pages/shared/InterviewDetails";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BackendStatus />
        <Routes>
          {/* Public routes with Navbar/Footer */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
          <Route path="/info/:section" element={<PublicLayout><InfoPage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
          <Route path="/verify-otp" element={<PublicLayout><VerifyOTP /></PublicLayout>} />

          {/* Protected Dashboard routes */}
          <Route path="/applicant/dashboard/*" element={
            <ProtectedRoute allowedRoles={["APPLICANT"]}>
              <ApplicantDashboard />
            </ProtectedRoute>
          } />
          <Route path="/company/dashboard/*" element={
            <ProtectedRoute allowedRoles={["COMPANY"]}>
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard/*" element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Shared Interview Details Route */}
          <Route path="/interview/:interviewId" element={
            <ProtectedRoute allowedRoles={["COMPANY", "APPLICANT"]}>
              <InterviewDetails />
            </ProtectedRoute>
          } />

          <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function PublicLayout({ children }) {
  return (
    <div className="grid-layout">
      <Navbar />
      <main className="grid-main">{children}</main>
      <Footer />
    </div>
  );
}
