import { useNavigate } from "react-router-dom";

export default function CandidateLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Logout sederhana untuk Candidate
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar Khusus Candidate (Hanya Logo & Logout) */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shadow-sm">
        <h1 className="text-2xl font-extrabold text-blue-900">EduPsych</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition"
        >
          Logout
        </button>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}