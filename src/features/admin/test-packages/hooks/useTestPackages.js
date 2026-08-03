import { useState, useEffect } from "react";
import api from "../../../../api/axiosConfig";
import toast from "react-hot-toast";

export function useTestPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/test-packages");
      const data = response.data.data || response.data;
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching test packages:", error);
      toast.error(error.response?.data?.message || "Gagal mengambil data paket tes");
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (data) => {
    try {
      const response = await api.post("/admin/test-packages", data);
      toast.success("Paket tes berhasil dibuat!");
      await fetchPackages();
      return response.data;
    } catch (error) {
      console.error("Error creating test package:", error);
      toast.error(error.response?.data?.message || "Gagal membuat paket tes");
      throw error;
    }
  };

  const updatePackage = async (id, data) => {
    try {
      const response = await api.put(`/admin/test-packages/${id}`, data);
      toast.success("Paket tes berhasil diperbarui!");
      await fetchPackages();
      return response.data;
    } catch (error) {
      console.error("Error updating test package:", error);
      toast.error(error.response?.data?.message || "Gagal memperbarui paket tes");
      throw error;
    }
  };

  const deletePackage = async (id) => {
    if (!window.confirm("Yakin ingin menghapus paket tes ini?")) return;

    try {
      await api.delete(`/admin/test-packages/${id}`);
      toast.success("Paket tes berhasil dihapus!");
      await fetchPackages();
    } catch (error) {
      console.error("Error deleting test package:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus paket tes");
    }
  };

  const getPackage = async (id) => {
    try {
      const response = await api.get(`/admin/test-packages/${id}`);
      setSelectedPackage(response.data.data || response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting test package:", error);
      toast.error(error.response?.data?.message || "Gagal mengambil data paket tes");
      throw error;
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    selectedPackage,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    getPackage,
    setSelectedPackage,
  };
}