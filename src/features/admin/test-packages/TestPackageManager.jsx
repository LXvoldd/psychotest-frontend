import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import api from "../../../api/axiosConfig";
import toast from "react-hot-toast";

export default function TestPackageManager() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin/test-packages");
      const data = response.data.data || [];
      setPackages(data);
    } catch (error) {
      console.error("Gagal memuat data:", error);
      toast.error("Gagal memuat data paket tes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus paket tes ini?")) return;
    try {
      await api.delete(`/admin/test-packages/${id}`);
      toast.success("Paket tes berhasil dihapus");
      fetchPackages();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Gagal menghapus paket tes");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-8 text-gray-500 text-center">Memuat data paket tes...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Test Packages</h1>
        <button 
          onClick={() => navigate("/admin/test-packages/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Tambah Paket Baru
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-16">NO</th>
                <th className="px-6 py-4">TEST NAME</th>
                <th className="px-6 py-4 text-center">TOTAL TAKEN</th>
                <th className="px-6 py-4 text-center">DURATION</th>
                <th className="px-6 py-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="font-medium text-gray-500">Belum ada data tes yang tersedia</p>
                      <p className="text-xs text-gray-400">Silakan buat paket tes baru melalui sistem</p>
                    </div>
                  </td>
                </tr>
              ) : (
                packages.map((pkg, i) => (
                  <tr key={pkg.id || i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{pkg.title}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {pkg.total_taken || 0}x taken
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {pkg.duration_minutes || 0} menit
                    </td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => navigate(`/admin/test-packages/edit/${pkg.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}