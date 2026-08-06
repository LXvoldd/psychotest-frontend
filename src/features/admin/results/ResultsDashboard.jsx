import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import api from "../../../api/axiosConfig";

export default function ResultsDashboard() {
  const [results, setResults] = useState([]);
  const [testPackages, setTestPackages] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    test_package_id: "",
    per_page: 10,
    page: 1
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = localStorage.getItem("user");
      if (!userData) {
        navigate("/login");
        return;
      }

      const params = new URLSearchParams();
      if (filters.test_package_id) params.append("test_package_id", filters.test_package_id);
      params.append("per_page", filters.per_page);
      params.append("page", filters.page);

      const response = await api.get(`/admin/results?${params.toString()}`);
      console.log("📊 All Results:", response.data);

      const rawData = response.data.data || response.data;
      
      const resultsArray = rawData.results || rawData.data || [];
      setResults(Array.isArray(resultsArray) ? resultsArray : []);
      
      if (rawData.pagination) {
        setPagination(rawData.pagination);
      }

    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        console.error("Error:", err);
        setError("Gagal memuat data hasil tes.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestPackages = async () => {
    try {
      const response = await api.get("/tests");
      const rawData = response.data.data || response.data;
      const list = Array.isArray(rawData) ? rawData : (rawData.results || []);
      setTestPackages(list);
    } catch (err) {
      console.warn("Gagal memuat list tes untuk filter");
    }
  };

  useEffect(() => {
    fetchTestPackages();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [filters.test_package_id, filters.page]);

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, test_package_id: e.target.value, page: 1 }));
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      setFilters(prev => ({ ...prev, page }));
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Memuat data hasil tes...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">All Results</h1>
        <p className="text-sm text-gray-500">Total Data: {pagination.total || results.length}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-64">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Filter by Test</label>
          <select 
            value={filters.test_package_id} 
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Tests</option>
            {testPackages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>{pkg.title || pkg.name || `Test ID ${pkg.id}`}</option>
            ))}
          </select>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-16">NO</th>
                <th className="px-6 py-4">NAMA KANDIDAT</th>
                <th className="px-6 py-4">EMAIL</th>
                <th className="px-6 py-4">TEST</th>
                <th className="px-6 py-4 text-center">SCORE</th>
                <th className="px-6 py-4 text-center">PERCENTAGE</th>
                <th className="px-6 py-4 text-center">STATUS</th>
                <th className="px-6 py-4 text-center">TANGGAL</th>
                <th className="px-6 py-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-400">
                    Belum ada data hasil tes.
                  </td>
                </tr>
              ) : (
                results.map((result, index) => {
                  const no = ((pagination.current_page - 1) * pagination.per_page) + (index + 1);

                  return (
                    <tr key={result.id || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-medium">{no}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {result.candidate_name || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {result.candidate_email || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {result.test_title || "Unknown Test"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-800">
                        {result.total_score !== null ? `${result.total_score}/${result.max_score}` : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {result.percentage !== null ? `${result.percentage.toFixed(2)}%` : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                          result.passed === true ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {result.passed === true ? "LULUS" : "GAGAL"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-xs text-gray-500">
                        {formatDate(result.submitted_at)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                          to={`/results/${result.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {pagination.last_page > 1 && (
        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500">
            Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-1">
            <button 
              onClick={() => goToPage(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="p-1 border border-gray-200 rounded bg-white text-gray-400 disabled:opacity-50 hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 border rounded text-xs font-medium transition-colors ${
                  pagination.current_page === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button 
              onClick={() => goToPage(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="p-1 border border-gray-200 rounded bg-white text-gray-400 disabled:opacity-50 hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}