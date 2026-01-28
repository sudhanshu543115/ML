import axios from "axios";

const api = axios.create({
   // baseURL: "http://localhost:5000/api",
 baseURL: "https://ml-backend-93ug.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});
api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
