import axios from "axios";

const API = axios.create({
  baseURL: "https://construction-backend-1-nnm1.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;