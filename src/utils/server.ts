import axios from "axios";

export const server = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    responseType:"json"
});