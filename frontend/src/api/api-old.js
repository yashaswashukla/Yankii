import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle cold start retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If timeout and haven't retried yet, try again
    if (error.code === "ECONNABORTED" && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest.timeout = 60000;
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  updatePassword: (data) => api.put("/auth/update-password", data),
  getProfile: () => api.get("/auth/profile"),
};

// Word APIs
export const wordAPI = {
  addWord: (word) => api.post("/words/add", { word }),
  getAllWords: (search = "") => api.get("/words/all", { params: { search } }),
  getDueWords: () => api.get("/words/review/due"),
  getNextWord: () => api.get("/words/review/next"),
  reviewWord: (id, quality) => api.post(`/words/review/${id}`, { quality }),
  deleteWord: (id) => api.delete(`/words/${id}`),
  getStats: () => api.get("/words/stats"),
};

export default api;
