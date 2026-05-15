import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ open, onClose }: any) => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    { name: "Tasks", path: "/projects/tasks" },
    { name: "Materials", path: "/projects/materials" },
    { name: "Subcontractors", path: "/projects/subcontractors" },
    { name: "Reports", path: "/projects/reports" },
  ];

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2 className="text-xl font-bold mb-6">
          Construction ERP
        </h2>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose} // ✅ auto close on click
              className={`block p-2 rounded transition ${
                location.pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;