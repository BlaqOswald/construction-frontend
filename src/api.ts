import axios from "axios";

const API = axios.create({
  baseURL: "https://construction-backend-1-nnm1.onrender.com",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ❌ DO NOT send token on login/register requests
  const isAuthRoute =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register");

  if (token && !isAuthRoute) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("TOKEN SENT:", !isAuthRoute ? token : "NO TOKEN (auth route)");

  return config;
});

export default API;