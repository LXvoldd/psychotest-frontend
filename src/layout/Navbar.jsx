import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig"; 

export default function Navbar() {
  const navigate = useNavigate();

  
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token"); 
      navigate("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {}
      <h2 className="text-lg font-semibold text-slate-800">Admin Dashboard</h2>

      {}
      <div className="flex items-center gap-4">
        {}
        
        {}
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 text-sm text-red-600 font-medium rounded hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}