import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import api from "../../../api/axiosConfig";

export default function TestPackageManager() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/admin/results");
        const rawData = response.data.data || response.data;
        
        let allResults = [];
        if (rawData && typeof rawData === 'object') {
          if (Array.isArray(rawData.results)) allResults = rawData.results;
          else if (Array.isArray(rawData)) allResults = rawData;
        }

        // Filter data unik berdasarkan nama tes
        const uniquePackages = [];
        const seenNames = new Set();
        
        allResults.forEach(item => {
          const name = item.test_package_name || item.test_name;
          // Jika ada nama tes yang valid, masukkan ke list
          if (name && !seenNames.has(name)) {
            seenNames.add(name);
            uniquePackages.push({ 
              name: name, 
              total_taken: allResults.filter(filterItem => 
                (filterItem.test_package_name || filterItem.test_name) === name
              ).length 
            });
          }
        });

        setPackages(uniquePackages);
      } catch (error) {
        console.error("Gagal memuat data paket tes:", error);
        setPackages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

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
        {/* Tombol Create dihilangkan sementara karena belum ada endpoint create-nya */}
        {/* Kamu bisa aktifkan lagi jika backend sudah menyediakan API untuk membuat tes baru */}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-16">NO</th>
                <th className="px-6 py-4">TEST NAME</th>
                <th className="px-6 py-4 text-center">TOTAL TAKEN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p className="font-medium text-gray-500">Belum ada data tes yang tersedia</p>
                      <p className="text-xs text-gray-400">Silakan buat paket tes baru melalui sistem</p>
                    </div>
                  </td>
                </tr>
              ) : (
                packages.map((pkg, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{pkg.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {pkg.total_taken}x taken
                      </span>
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