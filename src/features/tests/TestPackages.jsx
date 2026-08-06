import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import api from "../../../api/axiosConfig";
import toast from "react-hot-toast";

export default function TestPackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin/test-packages");
      setPackages(response.data.data || []);
    } catch (error) {
      console.error("Gagal memuat data:", error);
      toast.error("Gagal memuat daftar paket tes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus paket tes ini beserta semua soal dan opsinya?")) return;
    try {
      await api.delete(`/admin/test-packages/${id}`);
      toast.success("Paket tes berhasil dihapus");
      fetchPackages();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Gagal menghapus paket tes");
    }
  };

  if (isLoading) return <MainLayout><div className="p-8 text-gray-500 text-center">Memuat data...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="bg-[#f8faff] min-h-screen p-6">
        
        {/* ----- HEADER SECTION ----- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Question Bank</h1>
            <p className="text-gray-500 mt-1">Manage and organize your psychological assessment modules.</p>
          </div>
          <button 
            onClick={() => navigate("/admin/test-packages/create")}
            className="flex items-center gap-2 px-6 py-3 bg-[#0a2142] text-white rounded-xl hover:bg-[#0a2142]/90 transition shadow-md font-medium"
          >
            <span className="text-lg">+</span> Add Question
          </button>
        </div>

        {/* ----- LIST KARTU (MENGGANTIKAN TABEL) ----- */}
        <div className="space-y-4">
          {packages.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-gray-400 text-lg">Belum ada paket tes yang tersedia.</p>
            </div>
          ) : (
            packages.map((pkg, i) => (
              <div key={pkg.id || i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  
                  {/* Ikon Kategori (Kiri) */}
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 text-2xl">
                    📝
                  </div>

                  {/* Konten Utama (Tengah) */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        PKG-{pkg.id || "00"}
                      </span>
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {pkg.total_taken || 0} Attempts
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {pkg.title}
                    </h3>
                    {pkg.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {pkg.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>⏱ {pkg.duration_minutes || 0} mins</span>
                      <span>🎯 Passing Score: {pkg.passing_score || 0}%</span>
                    </div>
                  </div>

                  {/* Aksi (Kanan) */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/admin/test-packages/edit/${pkg.id}`)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ----- FOOTER PAGINATION ----- */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <p>Showing 1-{Math.min(packages.length, 10)} of {packages.length} tests</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>‹</button>
            <button className="px-3 py-1 bg-[#0a2142] text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}