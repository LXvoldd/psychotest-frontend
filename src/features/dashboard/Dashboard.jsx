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
  const [recentResults, setRecentResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          if (parsedUser.role !== "admin") {
            navigate("/candidate-dashboard");
            return;
          }
        } else {
          navigate("/login");
          return;
        }

        const dashboardRes = await api.get("/admin/results");
        const dashboardData = dashboardRes.data.data || dashboardRes.data;
        
        const summary = dashboardData.summary || {};
        setStats({
          tests: summary.tests_in_progress || 0,
          questions: summary.total_questions || 0,
          students: summary.total_candidates || 0
        });

        const resultsRes = await api.get("/admin/results");
        const rawData = resultsRes.data.data || resultsRes.data;
        
        let resultsArray = [];
        if (rawData && typeof rawData === 'object') {
          if (Array.isArray(rawData.results)) {
            resultsArray = rawData.results;
          } else if (Array.isArray(rawData)) {
            resultsArray = rawData;
          }
        }
        setRecentResults(resultsArray);

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Memverifikasi akses Anda...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full md:w-1/2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm" 
            placeholder="Search candidates by name or email..." 
            disabled 
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <div className="w-8 h-8 bg-indigo-900 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0) || "A"}
            </div>
            <span className="text-sm font-semibold text-blue-900 hidden sm:block">{user?.name || "Admin"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Tests in Progress</p>
            <h2 className="text-4xl font-bold text-slate-800 mb-3">{stats.tests}</h2>
            <div className="flex items-center gap-2 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full w-fit">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span> Total Active
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Total Questions</p>
            <h2 className="text-4xl font-bold text-slate-800 mb-3">{stats.questions}</h2>
            <div className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full w-fit">
              Total Bank Soal
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Total Students</p>
            <h2 className="text-4xl font-bold text-slate-800 mb-3">{stats.students}</h2>
            <div className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full w-fit">
              Total Kandidat
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-slate-800">Latest Test Results</h3>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 w-16">NO</th>
                  <th className="px-6 py-4">CANDIDATE</th>
                  <th className="px-6 py-4">TEST PACKAGE</th>
                  <th className="px-6 py-4 text-right w-24">SCORE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentResults.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                      Belum ada data hasil tes.
                    </td>
                  </tr>
                ) : (
                  recentResults.slice(0, 4).map((result, index) => (
                    <tr key={result.id || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-medium">{(index + 1).toString().padStart(2, '0')}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{result.candidate_name || "-"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{result.candidate_email || "-"}</p>
                      </td>
                      <td className="px-6 py-4">
                        {result.test_title ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {result.test_title}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Belum mulai</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">
                        {result.total_score !== null ? `${result.total_score}/${result.max_score}` : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-center">
            <button onClick={() => navigate("/results")} className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors">
              View All Results
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-slate-800">Student Data</h3>
            <p className="text-xs text-gray-400 mt-1">Real-time status tracking</p>
          </div>
          <div className="p-6 flex-1 space-y-4">
            {recentResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                <p className="text-sm font-medium text-gray-500">Tidak ada data kandidat</p>
              </div>
            ) : (
              recentResults.slice(0, 5).map((student) => {
                
                let statusColor = "bg-gray-100 text-gray-500";
                let statusLabel = "NOT STARTED";
                
                if (student.passed === true) {
                  statusColor = "bg-green-100 text-green-700";
                  statusLabel = "LULUS";
                } else if (student.passed === false) {
                  statusColor = "bg-red-100 text-red-700";
                  statusLabel = "GAGAL";
                }

                return (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{student.candidate_name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">ID: {student.id || "-"}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-b-xl">
            <p className="text-xs text-gray-500 font-medium">Showing {Math.min(5, recentResults.length)} of {stats.students}</p>
            <div className="flex gap-1">
              <button className="p-1 border border-gray-200 rounded bg-white text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <button className="p-1 border border-gray-200 rounded bg-white text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}