import { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { getResults, exportPDF } from "../../services/resultService";
import LoadingSkeleton from "../shared/components/LoadingSkeleton";
import EmptyState from "../shared/components/EmptyState";
import toast from "react-hot-toast";

export default function ResultList() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [exportingId, setExportingId] = useState(null);

  const fetchResults = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getResults({
        page,
        limit: pagination.perPage,
        search: filters.search || undefined,
        status: filters.status || undefined,
      });

      const data = response.data.data || response.data;
      const items = Array.isArray(data) ? data : data.items || [];
      const meta = data.meta || data.pagination || {};

      setResults(items);
      setPagination({
        currentPage: meta.current_page || page,
        totalPages: meta.total_pages || 1,
        totalItems: meta.total || items.length,
        perPage: meta.per_page || pagination.perPage,
      });
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error(error.response?.data?.message || "Gagal memuat hasil tes");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async (id) => {
    setExportingId(id);
    try {
      const response = await exportPDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `result-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF berhasil diunduh!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error(error.response?.data?.message || "Gagal mengunduh PDF");
    } finally {
      setExportingId(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchResults(1);
  }, [filters]);

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-700",
      in_progress: "bg-yellow-100 text-yellow-700",
      expired: "bg-red-100 text-red-700",
    };
    const labels = {
      completed: "✅ Selesai",
      in_progress: "⏳ Sedang Berjalan",
      expired: "⏰ Kadaluarsa",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hasil Tes</h1>
          <p className="text-sm text-gray-500 mt-1">Lihat dan kelola hasil tes kandidat</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Cari kandidat..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-40">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Status</option>
                <option value="completed">Selesai</option>
                <option value="in_progress">Sedang Berjalan</option>
                <option value="expired">Kadaluarsa</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Cari
            </button>
            <button
              type="button"
              onClick={() => {
                setFilters({ search: "", status: "" });
                fetchResults(1);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Reset
            </button>
          </form>
        </div>

        {loading ? (
          <LoadingSkeleton type="table" count={5} />
        ) : results.length === 0 ? (
          <EmptyState
            title="Belum Ada Hasil"
            description="Belum ada kandidat yang menyelesaikan tes."
            icon="📊"
          />
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Kandidat
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Paket Tes
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Skor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-800 text-sm">
                              {result.user?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-400">{result.user?.email || "-"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-700">
                            {result.test_package?.title || "Unknown"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-semibold ${
                              result.total_score >= (result.test_package?.passing_score || 70)
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.total_score || 0}%
                          </span>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(result.status)}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-500">
                            {result.submitted_at
                              ? new Date(result.submitted_at).toLocaleDateString("id-ID")
                              : "-"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleExportPDF(result.id)}
                            disabled={exportingId === result.id}
                            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition disabled:opacity-50"
                          >
                            {exportingId === result.id ? "⏳" : "📄 PDF"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Menampilkan {results.length} dari {pagination.totalItems} data
              </p>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}