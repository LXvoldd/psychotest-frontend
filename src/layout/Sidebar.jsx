import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50 shadow-xl">
            <div className="p-6 text-xl font-bold border-b border-slate-700">
                Psychotest
            </div>
            <nav className="flex flex-col p-4 gap-1 mt-4">
                <Link 
                    to="/dashboard" 
                    className={`px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/dashboard") ? "bg-blue-600 text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                >
                    Dashboard
                </Link>
                
                <Link 
                    to="/candidates" 
                    className={`px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/candidates") ? "bg-blue-600 text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                >
                    Candidates
                </Link>

                <Link 
                    to="/admin/test-packages" 
                    className={`px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/admin/test-packages") ? "bg-blue-600 text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                >
                    Test Packages
                </Link>

                {/* ✅ BAGIAN INI SAYA UBAH: /admin/results menjadi /results */}
                <Link 
                    to="/results" 
                    className={`px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/results") ? "bg-blue-600 text-white font-semibold shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                >
                    Results
                </Link>
            </nav>
        </aside>
    );
}