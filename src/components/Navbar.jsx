import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/projectvip-logo.jpg";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    const routes = {
      SUPER_ADMIN: "/admin/dashboard",
      COMPANY: "/company/dashboard",
      APPLICANT: "/applicant/dashboard",
    };
    return routes[user.role] || "/";
  };

  return (
    <nav className="sticky top-0 bg-black border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Project VIP Logo" className="h-14 w-14 rounded-lg object-cover" />
          <span className="text-2xl font-black text-white hidden sm:inline">Project VIP</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-sm font-semibold text-white hover:text-gray-300">Home</Link>
          <Link to="/info/about" className="text-sm font-semibold text-white hover:text-gray-300">About Us</Link>
          <Link to="/info/vision" className="text-sm font-semibold text-white hover:text-gray-300">Vision & Mission</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to={getDashboardLink()} className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800">
                <User size={18} />Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300">
                <LogOut size={18} />Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-800">Login</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700 px-4 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white font-semibold hover:text-gray-300">Home</Link>
          <Link to="/info/about" onClick={() => setMobileMenuOpen(false)} className="text-white font-semibold hover:text-gray-300">About Us</Link>
          <Link to="/info/vision" onClick={() => setMobileMenuOpen(false)} className="text-white font-semibold hover:text-gray-300">Vision & Mission</Link>
          
          {user ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="bg-red-700 text-white px-4 py-2 rounded-lg text-center">Dashboard</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-red-400 font-semibold text-left">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="bg-red-700 text-white px-4 py-2 rounded-lg text-center">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
