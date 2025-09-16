import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

export const createApi = () => {
  const api = axios.create({
    baseURL,
  });

  api.interceptors.request.use(
    (config) => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {}
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
};
