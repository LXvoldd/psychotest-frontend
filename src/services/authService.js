import publicApi from "../api/axios";
import privateApi from "../api/axiosConfig";

export const login = async (data) => {
  const response = await publicApi.post("/auth/login", data);
  return response;
};

export const register = async (data) => {
  const response = await publicApi.post("/auth/register", data);
  return response;
};

export const logout = async () => {
  const response = await privateApi.post("/auth/logout");
  return response;
};

export const me = async () => {
  const response = await privateApi.get("/auth/me");
  return response;
};