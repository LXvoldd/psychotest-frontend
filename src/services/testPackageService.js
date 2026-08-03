import api from "../api/axiosConfig";

export const getTestPackages = async () => {
  const response = await api.get("/admin/test-packages");
  return response;
};

export const createTestPackage = async (data) => {
  const response = await api.post("/admin/test-packages", data);
  return response;
};

export const updateTestPackage = async (id, data) => {
  const response = await api.put(`/admin/test-packages/${id}`, data);
  return response;
};

export const deleteTestPackage = async (id) => {
  const response = await api.delete(`/admin/test-packages/${id}`);
  return response;
};

export const getTestPackage = async (id) => {
  const response = await api.get(`/admin/test-packages/${id}`);
  return response;
};