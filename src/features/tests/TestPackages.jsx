import { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import api from "../../../api/axiosConfig";

export default function TestPackages() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

        // 🔥 PERBAIKAN DI SINI: Menggunakan Map untuk menghitung jumlah unik
        const packageMap = new Map();

        allResults.forEach(item => {
          // Gunakan test_title sesuai data asli dari backend
          const name = item.test_title; 
          
          if (name) {
            if (packageMap.has(name)) {
              // Jika sudah ada, tambah jumlahnya
              packageMap.set(name, packageMap.get(name) + 1);
            } else {
              // Jika belum ada, set awal 1
              packageMap.set(name, 1);
            }
          }
        });

        // Ubah Map menjadi Array of Objects
        const uniquePackages = Array.from(packageMap, ([name, total_taken]) => ({
          name,
          total_taken
        }));

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

  if (isLoading) return <MainLayout><div className="p-8 text-gray-500 text-center">Memuat data...</div></MainLayout>;

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Test Packages</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">NO</th>
              <th className="px-6 py-4">TEST NAME</th>
              <th className="px-6 py-4 text-center">TOTAL TAKEN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {packages.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                  Belum ada tes yang diambil.
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
    </MainLayout>
  );
}