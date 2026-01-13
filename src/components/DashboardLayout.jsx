import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform`}>
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.name || user?.email}</p>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === item.path ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-50 text-red-600">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between md:justify-end">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="text-sm text-gray-600">{user?.role}</span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
