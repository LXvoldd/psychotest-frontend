import { useState, useEffect } from "react";
import api from "../../../../api/axiosConfig";
import toast from "react-hot-toast";

export function useResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const fetchResults = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get("/admin/results", {
        params: {
          page,
          limit: pagination.perPage,
          search: filters.search || undefined,
          status: filters.status || undefined,
        },
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
      toast.error(error.response?.data?.message || "Gagal mengambil data hasil");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async (resultId) => {
    try {
      const response = await api.get(`/admin/results/${resultId}/export-pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `result-${resultId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF berhasil diunduh!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error(error.response?.data?.message || "Gagal mengunduh PDF");
    }
  };

  const changePage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchResults(page);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchResults(1);
  }, [filters]);

  return {
    results,
    loading,
    pagination,
    filters,
    fetchResults,
    exportPDF,
    changePage,
    updateFilters,
  };
}