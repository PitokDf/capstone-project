import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle response error
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error("Response error:", error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Request error:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;