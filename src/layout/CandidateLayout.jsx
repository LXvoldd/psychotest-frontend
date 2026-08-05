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
    { name: "Beranda", path: "/candidate-dashboard", icon: "" },
    { name: "My Assignments", path: "/candidate/assignments", icon: "" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8ff] flex">
      
      <aside className="w-64 bg-white border-r-2 border-gray-200 min-h-screen p-6 flex flex-col flex-shrink-0">
        
        <h1 className="text-2xl font-extrabold text-blue-900 mb-8 pb-4 border-b-2 border-gray-200">
          EduPsych
        </h1>
        
        <div className="mb-6 pb-4 border-b-2 border-gray-200">
          <p className="font-semibold text-slate-800">{user?.name || "Candidate"}</p>
          <p className="text-sm text-gray-500">{user?.grade || "Grade 12 - Science"}</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-[#5b9efc] text-white font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-600 hover:text-red-800 font-semibold text-left px-4 py-3 hover:bg-red-50 rounded-lg transition mt-auto pt-4 border-t-2 border-gray-200"
        >
          <span className="text-lg"></span>
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}