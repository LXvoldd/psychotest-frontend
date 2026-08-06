import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import api from "../../../api/axiosConfig";

export default function ResultDetail() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userData = localStorage.getItem("user");
        if (!userData) {
          navigate("/login");
          return;
        }

        const response = await api.get(`/admin/results/${id}`);
        console.log("Result Detail:", response.data);

        const data = response.data.data || response.data;
        setResult(data);

      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        } else {
          console.error("Error:", err);
          setError("Gagal memuat detail hasil tes.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Memuat detail jawaban...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      </MainLayout>
    );
  }

  if (!result) {
    return (
      <MainLayout>
        <div className="text-center text-gray-500 py-12">Data tidak ditemukan.</div>
      </MainLayout>
    );
  }

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const candidate = result.candidate || {};
  const test = result.test || {};
  const answers = result.answers || [];

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <button 
            onClick={() => navigate("/results")}
            className="mb-4 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Kembali ke Results
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Detail Hasil Tes</h1>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
            result.passed === true ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {result.passed === true ? "LULUS" : "GAGAL"}
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider text-gray-500">Info Kandidat</h3>
          <p className="text-sm font-semibold text-slate-800">{candidate.name || "-"}</p>
          <p className="text-sm text-gray-500">{candidate.email || "-"}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider text-gray-500">Info Tes & Skor</h3>
          <p className="text-sm font-semibold text-slate-800">{test.title || "-"}</p>
          <p className="text-sm text-gray-500">Passing Score: {test.passing_score || 0}</p>
          <div className="mt-2 p-2 bg-gray-50 rounded-lg flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Nilai Akhir:</span>
            <span className="text-lg font-bold text-indigo-600">
              {result.total_score || 0} / {result.max_score || 0} ({result.percentage ? result.percentage.toFixed(2) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider text-gray-500">Waktu Pengerjaan</h3>
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <p><span className="text-gray-500">Mulai:</span> {formatDate(result.started_at)}</p>
          <p><span className="text-gray-500">Selesai:</span> {formatDate(result.submitted_at)}</p>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-lg text-slate-800">Jawaban Per Soal</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-16">NO</th>
                <th className="px-6 py-4">PERTANYAAN</th>
                <th className="px-6 py-4">JAWABAN DIPILIH</th>
                <th className="px-6 py-4 text-center w-24">SKOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {answers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">Tidak ada data jawaban.</td>
                </tr>
              ) : (
                answers.map((ans, index) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-400 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{ans.question || "-"}</td>
                    <td className="px-6 py-4">{ans.selected || "-"}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{ans.score || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gray-50/50 border-t border-gray-100">
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right font-bold text-slate-800">Total Skor:</td>
                <td className="px-6 py-4 text-center font-bold text-indigo-600 text-lg">
                  {result.total_score || 0}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}