import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import api from "../../api/axiosConfig"; 

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    tests: 0,
    questions: 0,
    students: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        
        const userRes = await api.get("/auth/me");
        setUser(userRes.data.data || userRes.data);

        try {
          const statsRes = await api.get("/dashboard/stats"); 
          setStats(statsRes.data); 
        } catch (statsError) {
          console.warn("Endpoint /dashboard/stats belum dibuat, angka statistik tetap 0");
          
        }

      } catch (error) {
        console.error("Gagal mengambil data:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <MainLayout>
      {}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Psychotest Admin Portal</p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tests in Progress</p>
            <h2 className="text-3xl font-bold text-slate-800">{stats.tests}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Questions</p>
            <h2 className="text-3xl font-bold text-slate-800">{stats.questions}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Students</p>
            <h2 className="text-3xl font-bold text-slate-800">{stats.students}</h2>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        {isLoading ? (
          <p className="text-gray-400">Memuat data pengguna...</p>
        ) : user ? (
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Welcome back, {user.name || user.email}!
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 text-sm text-gray-500">
              <p>Email: <span className="text-slate-700 font-medium">{user.email}</span></p>
              <p>Role: <span className="text-slate-700 font-medium">{user.role || "Admin"}</span></p>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Gagal memuat data user.</p>
        )}
      </div>
    </MainLayout>
  );
}