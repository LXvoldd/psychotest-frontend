import api from "../api/axiosConfig"; 

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const me = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};