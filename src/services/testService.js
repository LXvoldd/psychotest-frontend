import api from "../api/axios";

export const getTests = async () => {
    const res = await api.get("/tests");
    return res.data;
};