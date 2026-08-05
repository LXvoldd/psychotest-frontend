import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CandidateLayout from "../../layout/CandidateLayout";
import api from "../../api/axiosConfig";

export default function CandidateAssignments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testPackages, setTestPackages] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
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

    } catch (error) {
      console.error("Error fetching assignments:", error);

      if (error.response?.status === 401) {
        toast.error("Sesi Anda habis, silakan login kembali.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login");
      } else {
        setError(error.response?.data?.message || "Gagal memuat data assignment");
        toast.error("Gagal memuat data assignment");
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

  if (loading) {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-900 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-500">Memuat daftar assignment...</p>
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
              onClick={fetchAssignments}
              className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  // Filter data berdasarkan status
  const activeTests = testPackages.filter(t => t.status !== "completed");
  const historyTests = testPackages.filter(t => t.status === "completed");

  // Filter data berdasarkan pencarian (Search)
  const filterBySearch = (tests) => {
    if (!searchQuery.trim()) return tests;
    const lowerQuery = searchQuery.toLowerCase();
    return tests.filter(test => 
      test.title?.toLowerCase().includes(lowerQuery) || 
      test.description?.toLowerCase().includes(lowerQuery)
    );
  };

  const filteredActiveTests = filterBySearch(activeTests);
  const filteredHistoryTests = filterBySearch(historyTests);

  // Render kartu tes
  const renderTestCard = (test) => {
    const isCompleted = test.status === "completed";
    const isInProgress = test.status === "in_progress";

    return (
      <div key={test.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
        
        {/* Header Kartu */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-2">
              {test.category || "Assessment"}
            </span>
            <h3 className="text-xl font-bold text-slate-800">{test.title}</h3>
            <p className="text-gray-500 text-sm mt-1 line-clamp-3 flex-grow">{test.description || "No description available."}</p>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            {isInProgress ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                In Progress
              </span>
            ) : isCompleted ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Not Started
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {test.duration_minutes || 0} mins
            </span>
          </div>
        </div>

        {/* Progress Bar (Hanya tampil jika Active) */}
        {!isCompleted && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{isInProgress ? "45%" : "0%"}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#0a2142] h-2 rounded-full transition-all duration-300"
                style={{ width: isInProgress ? "45%" : "0%" }}
              ></div>
            </div>
          </div>
        )}

        {/* Tombol Aksi & Footer (Dipaksa di paling bawah) */}
        {isCompleted ? (
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex justify-end">
              <span className="text-xs text-gray-400">Completed</span>
            </div>
          </div>
        ) : isInProgress ? (
          <button
            onClick={() => handleContinueTest(test.last_session_id)}
            className="w-full py-3 bg-[#0a2142] text-white font-semibold rounded-lg hover:bg-[#0a2142]/90 transition shadow-sm"
          >
            Continue Test
          </button>
        ) : (
          <button
            onClick={() => handleStartTest(test.id)}
            className="w-full py-3 border-2 border-[#0a2142] text-[#0a2142] font-semibold rounded-lg hover:bg-[#0a2142] hover:text-white transition"
          >
            Start Test
          </button>
        )}
      </div>
    );
  };

  return (
    <CandidateLayout>
      <div className="p-6 max-w-7xl mx-auto">
        
        {/* HEADER HALAMAN + SEARCH BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Assignments</h1>
            <p className="text-gray-500 mt-1">
              Manage your assigned assessments and track your progress through various psychological evaluations.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a2142] focus:border-[#0a2142] transition-colors bg-white" 
              placeholder="Search test..." 
            />
          </div>
        </div>

        {/* TAB ACTIVE / HISTORY */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "active"
                ? "border-[#0a2142] text-[#0a2142]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Active Tests ({filteredActiveTests.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "history"
                ? "border-[#0a2142] text-[#0a2142]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            History ({filteredHistoryTests.length})
          </button>
        </div>

        {/* GRID TES */}
        {activeTab === "active" ? (
          filteredActiveTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredActiveTests.map((test) => renderTestCard(test))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">
                {searchQuery ? `Tidak ada tes yang cocok dengan "${searchQuery}"` : "Tidak ada tes yang sedang aktif."}
              </p>
            </div>
          )
        ) : (
          filteredHistoryTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHistoryTests.map((test) => renderTestCard(test))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">
                {searchQuery ? `Tidak ada riwayat tes yang cocok dengan "${searchQuery}"` : "Belum ada riwayat tes."}
              </p>
            </div>
          )
        )}

      </div>
    </CandidateLayout>
  );
}