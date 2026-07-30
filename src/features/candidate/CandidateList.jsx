import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";

export default function CandidateList() {
  const navigate = useNavigate();

  
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "candidate") {
      navigate("/candidate-dashboard");
    }
  }, [navigate]);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800">Candidate Management</h1>
        <p className="text-gray-500 mt-2">Halaman ini hanya bisa diakses oleh Admin.</p>
        
        {}
        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-400">(Tabel kandidat akan ditampilkan di sini)</p>
        </div>
      </div>
    </MainLayout>
  );
}