import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import TestPackageForm from "../admin/test-packages/components/TestPackageForm";
import { useTestPackages } from "../admin/test-packages/hooks/useTestPackages";
import LoadingSkeleton from "../shared/components/LoadingSkeleton";
import toast from "react-hot-toast";

export default function TestForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { createPackage, updatePackage, getPackage, loading } = useTestPackages();
  const [initialData, setInitialData] = useState(null);
  const [fetching, setFetching] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchData = async () => {
        try {
          const response = await getPackage(id);
          setInitialData(response.data || response);
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
  }, [id, isEdit]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await updatePackage(id, data);
      } else {
        await createPackage(data);
      }
      navigate("/admin/test-packages");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/test-packages");
  };

  if (fetching) {
    return (
      <MainLayout>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <LoadingSkeleton type="form" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {isEdit ? "Edit Paket Tes" : "Buat Paket Tes Baru"}
        </h2>
        <TestPackageForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={submitting || loading}
        />
      </div>
    </MainLayout>
  );
}