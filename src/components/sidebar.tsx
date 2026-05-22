import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ open, onClose }: any) {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const menu = [
    { name: "Dashboard", path: "/dashboard", roles: ["admin", "manager", "client"] },
    { name: "Projects", path: "/projects", roles: ["admin", "manager", "client"] },

    // ✅ NEW MODULES (kept same routing style as your system)
    { name: "Pre-Development", path: "/projects/predevelopment", roles: ["admin", "manager"] },

    { name: "Tasks", path: "/projects/tasks", roles: ["admin", "manager"] },
    { name: "Materials", path: "/projects/materials", roles: ["admin", "manager"] },
    { name: "Subcontractors", path: "/projects/subcontractors", roles: ["admin", "manager"] },

    { name: "Suppliers", path: "/projects/suppliers", roles: ["admin", "manager"] },
    { name: "Site Overheads", path: "/projects/site-overheads", roles: ["admin", "manager"] },

    { name: "Reports", path: "/projects/reports", roles: ["admin", "manager", "client"] },
    { name: "Users", path: "/users", roles: ["admin"] },
  ];

  return (
    <>
      {/* BACKDROP (mobile only) */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50
          top-0 left-0 h-full w-64
          bg-gray-900 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          Construction ERP
        </div>

        <nav className="p-4 flex flex-col gap-2">
          {menu
            .filter((item) => item.roles.includes(role))
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  p-2 rounded
                  transition
                  ${
                    location.pathname === item.path
                      ? "bg-blue-600"
                      : "hover:bg-gray-700"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
        </nav>
      </aside>
    </>
  );
}