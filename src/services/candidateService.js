import api from "../api/axios";

export const getCandidates = async () => {
    const res = await api.get("/admin/candidates");
    return res.data;
};