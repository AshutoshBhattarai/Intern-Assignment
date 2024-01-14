import axios from "axios";
import TokenService from "./TokenService";

const http = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// const excludeRoutes = ["/register", "/login", "/refresh"];

// http.interceptors.request.use((config) => {
//   if (excludeRoutes.includes(config.url as string)) {
//     return config;
//   }
//   const token = TokenService.getAccessToken();
//   if (token) {
//     config.headers["Authorization"] = "Bearer " + token;
//   }
//   return config;
// });

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await TokenService.getNewAccessToken();
        const newAccessToken = TokenService.getAccessToken();
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        return http(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export default http;
