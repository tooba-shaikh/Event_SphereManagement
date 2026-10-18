import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("eventsphere_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (e) {
      console.error("Error setting auth token header", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
