import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
let store;
export const injectStore = (_store) => {
  store = _store;
};
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403) {
      const message = error.response?.data?.message || "";
      if (
        message.toLowerCase().includes("blocked") ||
        message.toLowerCase().includes("block") ||
        message.toLowerCase().includes("contact support")
      ) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");

        if (store) {
          store.dispatch({ type: "auth/logout" });
        }

        window.location.href = "/login";

        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            "http://localhost:3000/api/auth/refresh",
            {
              token: refreshToken,
            }
          );

          localStorage.setItem("accessToken", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userData");
          if (store) {
            store.dispatch({ type: "auth/logout" });
          }
          window.location.href = "/login";

          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
