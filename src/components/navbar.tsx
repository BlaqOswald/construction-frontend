import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-[60px] bg-white flex items-center justify-between px-6 border-b shadow-sm">
      {/* Left */}
      <h1 className="font-bold text-lg">Construction ERP</h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600">👤 User</span>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
