import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar({ onMenuClick }: any) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="h-[60px] bg-white flex items-center justify-between px-4 sm:px-6 border-b shadow-sm">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={onMenuClick}
          className="text-2xl md:hidden"
        >
          ☰
        </button>

        <h1 className="font-bold text-lg">
          Construction ERP
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 relative">

        {/* USER BUTTON */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-700 font-medium"
          >
            👤 {user?.name || "User"}
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">

              {/* ADMIN */}
              {role === "admin" && (
                <Link
                  to="/users"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  User Management
                </Link>
              )}

              {/* ADMIN + MANAGER */}
              {(role === "admin" || role === "manager") && (
                <Link
                  to="/projects"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Projects
                </Link>
              )}

              {/* MANAGER ONLY */}
              {role === "manager" && (
                <>
                  <Link
                    to="/projects"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Tasks
                  </Link>

                  <Link
                    to="/projects"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Materials
                  </Link>
                </>
              )}

              {/* CLIENT */}
              {role === "client" && (
                <Link
                  to="/projects"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  My Projects
                </Link>
              )}

              <hr className="my-1" />

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}