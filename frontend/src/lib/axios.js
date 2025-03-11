import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5055/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});