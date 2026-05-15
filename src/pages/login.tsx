import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      // FIRST TIME LOGIN (TEMP PASSWORD FLOW)
      if (response.data.requiresPasswordChange) {
        localStorage.setItem("tempEmail", response.data.email);
        navigate("/set-password");
        return;
      }

      // NORMAL LOGIN
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.role);

      console.log("LOGIN SUCCESS:", response.data);

      navigate("/dashboard");
    } catch (err: any) {
      console.error("LOGIN ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 shadow-lg rounded w-80 bg-white">

        <h1 className="text-xl font-bold mb-4 text-center">
          Login
        </h1>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>

      </div>
    </div>
  );
}