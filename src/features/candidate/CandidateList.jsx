import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import api from "../../api/axiosConfig";

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-8 text-gray-500 text-center">Memuat data kandidat...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Candidate Management</h1>
        <p className="text-sm text-gray-500">Total: {candidates.length} Kandidat</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-16">NO</th>
                <th className="px-6 py-4">NAMA KANDIDAT</th>
                <th className="px-6 py-4">EMAIL</th>
                <th className="px-6 py-4 text-center">STATUS TERAKHIR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    Belum ada data kandidat.
                  </td>
                </tr>
              ) : (
                candidates.map((c, i) => {
                  // Logic status badge
                  let statusColor = "bg-gray-100 text-gray-500";
                  let statusLabel = "NOT STARTED";
                  if (c.status === "completed" || c.status === "passed") {
                    statusColor = "bg-green-100 text-green-700";
                    statusLabel = "COMPLETED";
                  } else if (c.status === "testing" || c.status === "in_progress") {
                    statusColor = "bg-blue-100 text-blue-700";
                    statusLabel = "TESTING";
                  }

                  return (
                    <tr key={c.id || i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-medium">{i + 1}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {c.candidate_name || c.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {c.candidate_email || c.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${statusColor}`}>
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
      </div>
    </MainLayout>
  );
}