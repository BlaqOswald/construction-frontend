import { useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

export default function MainLayout({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* BACKDROP (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static z-50
          h-full md:h-auto
          w-64 bg-white shadow-lg
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col w-full">

        {/* NAVBAR */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* PAGE CONTENT */}
        <main className="p-3 sm:p-6 overflow-y-auto w-full">
          {children}
        </main>

      </div>
    </div>
  );
}