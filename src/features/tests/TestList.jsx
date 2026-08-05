import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import { useTestPackages } from "../admin/test-packages/hooks/useTestPackages";
import LoadingSkeleton from "../shared/components/LoadingSkeleton";
import EmptyState from "../shared/components/EmptyState";
import toast from "react-hot-toast";

export default function TestList() {
  const navigate = useNavigate();
  const { packages, loading, deletePackage } = useTestPackages();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deletePackage(id);
    setDeletingId(null);
  };

  const handleEdit = (pkg) => {
    navigate(`/admin/test-packages/edit/${pkg.id}`);
  };

  const handleCreate = () => {
    navigate("/admin/test-packages/create");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Paket Tes</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola paket tes psikotes</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
          >
            + Buat Paket Tes
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton type="table" count={5} />
        ) : packages.length === 0 ? (
          <EmptyState
            title="Belum Ada Paket Tes"
            description="Mulai buat paket tes pertama untuk kandidat."
            icon=""
            actionText="Buat Paket Tes"
            onAction={handleCreate}
          />
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800">{pkg.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{pkg.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <span className="text-gray-400">⏱ {pkg.duration_minutes} Menit</span>
                      <span className="text-gray-400"> Passing: {pkg.passing_score}%</span>
                      <span className="text-gray-400"> {pkg.questions?.length || 0} Soal</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      disabled={deletingId === pkg.id}
                      className="px-3 py-1 text-sm text-red-500 hover:text-red-700 transition disabled:opacity-50"
                    >
                      {deletingId === pkg.id ? "" : "Hapus"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}