import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Axios = axios.create({
    baseURL: BACKEND_URL,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true,
});

Axios.interceptors.request.use((config) => {
    const token = Cookies.get('access_token');
    if (token !== 'undefined' && token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Content-Type"] = "application/json";
    }
    return config;
});
