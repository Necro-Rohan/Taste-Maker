import axios from 'axios'

const backendURL = import.meta.env.VITE_API_BASE_URL || "/";
const api = axios.create({
  withCredentials: true,
  baseURL: backendURL,
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh" &&
      originalRequest.url !== "/auth/login" 
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh", {}, { withCredentials: true });
        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
)

export default api;
