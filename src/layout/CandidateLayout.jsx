import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosConfig";

export default function CandidateLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      toast.success("Logout berhasil!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  const navItems = [
    { name: "Beranda", path: "/candidate-dashboard", icon: "🏠" },
    { name: "My Assessments", path: "/candidate/tests", icon: "📝" },
    { name: "Results", path: "/candidate/results", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8ff] flex">
      
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col flex-shrink-0">
        
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-blue-900 mb-8">EduPsych</h1>
        
        {/* User Profile */}
        <div className="mb-6">
          <p className="font-semibold text-slate-800">{user?.name || "Candidate"}</p>
          <p className="text-sm text-gray-500">{user?.grade || "Grade 12 - Science"}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-50 text-blue-900 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 font-semibold text-left px-4 py-3 hover:bg-red-50 rounded-lg transition mt-auto"
        >
          🚪 Logout
        </button>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}