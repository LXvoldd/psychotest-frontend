import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = localStorage.getItem("role");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        toast.success("Logout berhasil!");
        navigate("/login");
        return;
      }

      await logout();
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      toast.success("Logout berhasil!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Sesi Anda telah berakhir, logout otomatis.");
      } else if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        toast.error("Koneksi timeout, tapi Anda tetap logout.");
      } else {
        toast.error("Gagal logout, tapi Anda tetap akan diarahkan ke login.");
      }
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-slate-800">
        {role === "admin" ? "Admin Dashboard" : "Candidate Dashboard"}
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name || "User"}
        </span>
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