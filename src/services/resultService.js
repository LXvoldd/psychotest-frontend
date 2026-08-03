import api from "../api/axiosConfig";

export const getResults = async (params) => {
  const response = await api.get("/admin/results", { params });
  return response;
};

export const getResultDetail = async (id) => {
  const response = await api.get(`/admin/results/${id}`);
  return response;
};

export const exportPDF = async (id) => {
  const response = await api.get(`/admin/results/${id}/export-pdf`, {
    responseType: "blob",
  });
  return response;
};

export const deleteResult = async (id) => {
  const response = await api.delete(`/admin/results/${id}`);
  return response;
};