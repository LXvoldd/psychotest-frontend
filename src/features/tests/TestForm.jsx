import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layout/MainLayout"; // PATH BENAR (2 turun)
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";

export default function TestForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetching, setFetching] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const getPackage = async (packageId) => {
    try {
      const response = await api.get(`/admin/test-packages/${packageId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching package:", error);
      throw error;
    }
  };

  const createPackage = async (data) => {
    const response = await api.post("/admin/test-packages", data);
    return response.data;
  };

  const updatePackage = async (packageId, data) => {
    const response = await api.put(`/admin/test-packages/${packageId}`, data);
    return response.data;
  };

  useEffect(() => {
    if (isEdit) {
      const fetchData = async () => {
        try {
          const resData = await getPackage(id);
          setInitialData(resData.data || resData);
        } catch (error) {
          console.error("Error fetching package:", error);
          toast.error("Gagal mengambil data paket tes");
          navigate("/admin/test-packages");
        } finally {
          setFetching(false);
        }
      };
      fetchData();
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Convert angka yang dikirim sebagai string menjadi number
    const payload = {
      title: data.title,
      description: data.description,
      duration_minutes: parseInt(data.duration_minutes),
      passing_score: parseInt(data.passing_score)
    };

    try {
      if (isEdit) {
        await updatePackage(id, payload);
        toast.success("Paket tes berhasil diperbarui!");
      } else {
        await createPackage(payload);
        toast.success("Paket tes berhasil dibuat!");
      }
      navigate("/admin/test-packages");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan paket tes");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/test-packages");
  };

  // Loading State
  if (fetching) {
    return (
      <MainLayout>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          {isEdit ? "Edit Paket Tes" : "Buat Paket Tes Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Judul Tes <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="title" 
              defaultValue={initialData?.title || ""}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Contoh: Tes Integritas & Etika"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Deskripsi Tes
            </label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description || ""}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Masukkan deskripsi singkat tentang tes ini..."
            />
          </div>

          {/* Duration & Passing Score */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Durasi (Menit) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                name="duration_minutes" 
                defaultValue={initialData?.duration_minutes || 30}
                required
                min="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Passing Score (%) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                name="passing_score" 
                defaultValue={initialData?.passing_score || 60}
                required
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button 
              type="button" 
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
            >
              {submitting ? "Menyimpan..." : (isEdit ? "Perbarui" : "Simpan")}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}