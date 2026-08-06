import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CandidateLayout from "../../layout/CandidateLayout";
import api from "../../api/axiosConfig";
import { logout } from "../../services/authService";

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [testPackages, setTestPackages] = useState([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    inProgressTests: 0,
    averageScore: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Silakan login terlebih dahulu");
        navigate("/login");
        return;
      }

      const testsRes = await api.get("/tests");
      const tests = testsRes.data.data || [];
      setTestPackages(tests);

      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }

      const totalTests = tests.length;
      const completedTests = tests.filter(t => t.status === "completed").length;
      const inProgressTests = tests.filter(t => t.status === "in_progress").length;
      
      const completedScores = tests
        .filter(t => t.status === "completed")
        .map(t => t.score || 0);
      const averageScore = completedScores.length > 0
        ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length)
        : 0;

      setStats({
        totalTests,
        completedTests,
        inProgressTests,
        averageScore,
      });

    } catch (error) {
      console.error("Error fetching dashboard:", error);

      if (error.response?.status === 401) {
        toast.error("Sesi Anda habis, silakan login kembali.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login");
      } else if (error.response?.status === 404) {
        setError("Endpoint /tests belum tersedia di backend.");
        toast.error("Backend endpoint belum tersedia");
      } else {
        setError(error.response?.data?.message || "Gagal memuat data dashboard");
        toast.error("Gagal memuat data dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testPackageId) => {
    try {
      const response = await api.post(`/tests/${testPackageId}/start`);
      const { session_id } = response.data.data;
      
      toast.success("Tes dimulai! Selamat mengerjakan.");
      navigate(`/candidate/test/${session_id}`);
    } catch (error) {
      console.error("Error starting test:", error);
      toast.error(error.response?.data?.message || "Gagal memulai tes");
    }
  };

  const handleContinueTest = (lastSessionId) => {
    if (!lastSessionId) {
      toast.error("Tidak ada sesi aktif untuk dilanjutkan.");
      return;
    }
    navigate(`/candidate/test/${lastSessionId}`);
  };

  const handleViewResult = () => {
    toast.info("Hasil tes tidak dapat diakses oleh Candidate. Kembali ke dashboard.");
    navigate("/candidate-dashboard");
  };

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

  if (loading) {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-900 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-500">Memuat dashboard...</p>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  if (error) {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Gagal Memuat Data</h3>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  const activeTest = testPackages.find(
    (test) => test.status === "in_progress"
  );

  return (
    <CandidateLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Selamat Datang, {user?.name || "Candidate"}!
            </h1>
            <p className="text-gray-500 mt-1">
              {user?.email || ""} • Mari lanjutkan perjalanan eksplorasi potensi diri Anda hari ini.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-semibold transition"
          >
            Logout
          </button>
        </div>

        {activeTest && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">
                   Tes Sedang Berjalan
                </h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Anda memiliki tes yang belum selesai. Lanjutkan mengerjakan!
                </p>
              </div>
              <button
                onClick={() => handleContinueTest(activeTest.last_session_id)}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold"
              >
                Lanjutkan Tes
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-3xl font-bold text-blue-900">{stats.totalTests}</p>
            <p className="text-gray-500 text-sm">Total Tes</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-3xl font-bold text-green-600">{stats.completedTests}</p>
            <p className="text-gray-500 text-sm">Tes Selesai</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-3xl font-bold text-orange-500">{stats.inProgressTests}</p>
            <p className="text-gray-500 text-sm">Sedang Berjalan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Daftar Tes Tersedia</h2>
            </div>

            {testPackages.length > 0 ? (
              testPackages.slice(0, 4).map((test) => {
                const isCompleted = test.status === "completed";
                const isInProgress = test.status === "in_progress";

                return (
                  <div key={test.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800">{test.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{test.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-gray-400">⏱ {test.duration_minutes} Menit</span>
                          {isCompleted && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"> Selesai</span>
                          )}
                          {isInProgress && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full"> Sedang Berjalan</span>
                          )}
                        </div>
                      </div>
                      {isCompleted ? (
                        null 
                      ) : isInProgress ? (
                        <button
                          onClick={() => handleContinueTest(test.last_session_id)}
                          className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold text-sm"
                        >
                          Lanjutkan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartTest(test.id)}
                          className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-semibold text-sm"
                        >
                          Mulai Tes
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500">Belum ada tes yang tersedia.</p>
              </div>
            )}
            
            {}
            {testPackages.length > 4 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => navigate("/candidate/assignments")}
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-semibold text-sm"
                >
                  Lihat Semua di My Assignments
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Riwayat Tes</h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              {testPackages.filter(t => t.status === "completed").length > 0 ? (
                testPackages
                  .filter((test) => test.status === "completed")
                  .slice(0, 5)
                  .map((test) => {
                    return (
                      <div key={test.id} className="py-3 border-b border-gray-100 last:border-0">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            <p className="font-medium text-slate-700 text-sm">
                              {test.title || "Tes"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {test.completed_at ? new Date(test.completed_at).toLocaleDateString('id-ID') : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  Belum ada tes yang selesai
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </CandidateLayout>
  );
}