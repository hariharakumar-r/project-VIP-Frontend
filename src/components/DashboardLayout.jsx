import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/projectvip-logo.jpg";

export default function DashboardLayout({ children, menuItems, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1F1C18] to-[#8E0E00] flex">
      {/* Fixed Logo - Top Left Corner */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <img src={logo} alt="Project VIP Logo" className="h-16 w-16 rounded-lg object-cover shadow-lg" />
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform flex flex-col border-r border-gray-700`}>
        <div className="p-6 border-b border-gray-700 flex-shrink-0 flex items-center gap-4">
          <img src={logo} alt="Project VIP Logo" className="h-14 w-14 rounded-lg object-cover flex-shrink-0" />
          <div>
            <h1 className="text-lg font-bold text-white">{title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{user?.name || user?.email}</p>
          </div>
        </div>
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === item.path ? "bg-red-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900 text-red-400 hover:text-red-300 transition">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <header className="bg-black shadow-lg p-4 flex items-center justify-between md:justify-end border-b border-gray-700">
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="text-sm text-gray-400">{user?.role}</span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
