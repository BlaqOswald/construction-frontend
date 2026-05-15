import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("tempEmail");

  const submit = async () => {
    try {
      if (!email) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      await API.post("/users/set-password", {
        email,
        password,
      });

      localStorage.removeItem("tempEmail");

      alert("Password set successfully. Please login.");
      navigate("/login");

    } catch (err: any) {
      console.error("SET PASSWORD ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Failed to set password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 border rounded w-80 bg-white shadow-md">

        <h2 className="text-lg font-bold mb-4 text-center">
          Set Your Password
        </h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
        >
          Save Password
        </button>

      </div>
    </div>
  );
}