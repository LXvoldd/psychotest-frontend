import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import api from "../../api/axiosConfig";

export default function Results() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllResults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userData = localStorage.getItem("user");
        if (!userData) {
          navigate("/login");
          return;
        }

        const response = await api.get("/admin/results");
        console.log("📊 Semua Results:", response.data);

        const rawData = response.data.data || response.data;
        let resultsArray = [];

        if (rawData && typeof rawData === 'object') {
          if (Array.isArray(rawData.results)) {
            resultsArray = rawData.results;
          } else if (Array.isArray(rawData)) {
            resultsArray = rawData;
          }
        }

        setResults(resultsArray);

      } catch (err) {
        console.error("Error mengambil results:", err);
        setError("Gagal memuat data hasil tes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllResults();
  }, [navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Memuat semua hasil tes...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">All Results</h1>
        <p className="text-sm text-gray-500">Total Data: {results.length}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-16">NO</th>
                <th className="px-6 py-4">NAMA KANDIDAT</th>
                <th className="px-6 py-4">EMAIL</th>
                <th className="px-6 py-4">TEST PACKAGE</th>
                <th className="px-6 py-4 text-center">SCORE</th>
                <th className="px-6 py-4 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    Belum ada data hasil tes.
                  </td>
                </tr>
              ) : (
                results.map((result, index) => {
                  let statusColor = "bg-gray-100 text-gray-500";
                  let statusLabel = "NOT STARTED";
                  if (result.status === "completed" || result.status === "passed") {
                    statusColor = "bg-green-100 text-green-700";
                    statusLabel = "COMPLETED";
                  } else if (result.status === "testing" || result.status === "in_progress") {
                    statusColor = "bg-blue-100 text-blue-700";
                    statusLabel = "TESTING";
                  }

                  return (
                    <tr key={result.id || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {result.candidate_name || result.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {result.candidate_email || result.email || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {result.test_package_name || result.test_name ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {result.test_package_name || result.test_name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Belum mulai</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-800">
                        {result.score !== null && result.score !== undefined ? result.score : "-"}
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