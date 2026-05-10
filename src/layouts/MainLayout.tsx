import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

export default function MainLayout({ children }: any) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
