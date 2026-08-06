import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import api from "../../api/axiosConfig";

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/admin/results");
        const rawData = response.data.data || response.data;
        
        let allResults = [];
        if (rawData && typeof rawData === 'object') {
          if (Array.isArray(rawData.results)) allResults = rawData.results;
          else if (Array.isArray(rawData)) allResults = rawData;
        }
        setCandidates(allResults);
      } catch (error) {
        console.error("Gagal memuat data kandidat:", error);
        setCandidates([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (c.candidate_name || c.name || "").toLowerCase().includes(searchLower) ||
      (c.candidate_email || c.email || "").toLowerCase().includes(searchLower);

    const status = c.status || "not_started";
    let matchesStatus = true;
    if (statusFilter === "completed") {
      matchesStatus = status === "completed" || status === "passed";
    } else if (statusFilter === "in_progress") {
      matchesStatus = status === "in_progress";
    } else if (statusFilter === "not_started") {
      matchesStatus = status === "not_started" || status === "available";
    }

    return matchesSearch && matchesStatus;
  });

  const totalStudents = candidates.length;
  const completed = candidates.filter(c => c.status === "completed" || c.passed === true).length;
  const inProgress = candidates.filter(c => c.status === "in_progress").length;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-8 text-gray-500 text-center">Memuat data kandidat...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 bg-[#f6f8ff] min-h-screen">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2142]"
              placeholder="Search for students, IDs, or classes..." 
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="w-10 h-10 bg-[#0a2142] rounded-full flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold text-slate-800">Admin User</span>
              <span className="text-xs text-gray-400">Psychotest Admin</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <div className="bg-blue-50 p-2 rounded-lg"></div>
            </div>
            <p className="text-4xl font-bold text-[#0a2142]">{totalStudents}</p>
            <p className="text-xs text-blue-500 font-medium mt-1">+12% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <div className="bg-blue-50 p-2 rounded-lg"></div>
            </div>
            <p className="text-4xl font-bold text-[#0a2142]">{completed}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#0a2142] h-2 rounded-full" style={{ width: `${totalStudents > 0 ? (completed/totalStudents) * 100 : 0}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <div className="bg-blue-50 p-2 rounded-lg"></div>
            </div>
            <p className="text-4xl font-bold text-[#0a2142]">{inProgress}</p>
            <p className="text-xs text-gray-400 mt-1">Avg. time: 42 mins</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-[#0a2142] outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="not_started">Not Started</option>
              </select>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                More Filters
              </button>
            </div>
            <button className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8faff] text-slate-500 uppercase text-xs font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Gmail</th>
                  <th className="px-6 py-4">Test Progress</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      {searchQuery ? `Tidak ada kandidat dengan nama/email "${searchQuery}"` : "Belum ada data kandidat."}
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((c, i) => {
                    const percentage = c.percentage || 0;
                    
                    let statusColor = "bg-gray-100 text-gray-500";
                    let statusLabel = "Not Started";
                    if (c.status === "completed" || c.passed === true) {
                      statusColor = "bg-blue-100 text-blue-700";
                      statusLabel = "Completed";
                    } else if (c.status === "in_progress") {
                      statusColor = "bg-indigo-100 text-indigo-700";
                      statusLabel = "In Progress";
                    }

                    const initialAvatar = (c.candidate_name || c.name || "U").charAt(0).toUpperCase();

                    return (
                      <tr key={c.id || i} className="hover:bg-[#fafbff] transition-colors">
                        <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${c.status === "completed" || c.passed === true ? 'bg-blue-500' : 'bg-gray-400'}`}>
                              {initialAvatar}
                            </div>
                            <span className="font-medium text-slate-800">{c.candidate_name || c.name || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{c.candidate_email || c.email || "-"}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-[#0a2142] h-1.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-[#0a2142]">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusColor.split(' ')[1]}`}></span>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex flex-wrap items-center justify-between text-sm text-gray-500">
            <p>Showing 1-{Math.min(filteredCandidates.length, 10)} of {filteredCandidates.length} students</p>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>‹</button>
              <button className="px-3 py-1 bg-[#0a2142] text-white rounded">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">›</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}