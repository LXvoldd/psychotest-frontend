import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import api from "../../api/axiosConfig";

export default function Candidates() {
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

  if (isLoading) return <MainLayout><div className="p-8 text-gray-500 text-center">Memuat data...</div></MainLayout>;

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">All Candidates</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
            <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">NAME</th><th className="px-6 py-4">EMAIL</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {candidates.length === 0 ? (
              <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400">Belum ada kandidat.</td></tr>
            ) : (
              candidates.map((c, i) => (
                <tr key={c.id || i} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-gray-500">{c.id || "-"}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{c.candidate_name || c.name || "-"}</td>
                  <td className="px-6 py-4 text-gray-500">{c.candidate_email || c.email || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}