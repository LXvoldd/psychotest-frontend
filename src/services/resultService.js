import api from "../api/axiosConfig";

export const getResults = async () => {
    const res = await api.get("/admin/results");
    return res.data;
};

export const exportPDF = (id) => {
  
    const baseURL = import.meta.env.VITE_API_URL;
    
    
    window.open(
        `${baseURL}/admin/results/${id}/export-pdf`,
        "_blank"
    );
};