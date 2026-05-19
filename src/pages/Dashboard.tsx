import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

const Dashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  const createProject = () => {
    const name = prompt("Project name:");
    const location = prompt("Location:");
    const type = prompt("Project type:");

    if (!name) return;

    API.post("/projects", {
      name,
      location,
      type,
    })
      .then((res) => {
        setProjects([...projects, res.data]);
      })
      .catch((err) => console.error(err));
  };

  return (
    <MainLayout>
      <div className="p-3 sm:p-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            Projects Dashboard
          </h1>

          <button
            onClick={createProject}
            className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            + New Project
          </button>
        </div>

        {/* PROJECT LIST */}
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-white shadow p-4 rounded-lg cursor-pointer hover:shadow-md transition"
              >
                {/* PROJECT INFO */}
                <h2 className="text-lg font-bold break-words">
                  {p.name}
                </h2>

                <p className="text-sm text-gray-500 break-words">
                  {p.location}
                </p>

                <p className="text-sm text-gray-700">
                  {p.type}
                </p>

                {/* ACTIONS */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/projects/${p.id}/tasks`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Tasks
                  </button>

                  <button
                    onClick={() => navigate(`/projects/${p.id}/materials`)}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Materials
                  </button>

                  <button
                    onClick={() => navigate(`/projects/${p.id}/subcontractors`)}
                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Subcontractors
                  </button>

                  <button
                    onClick={() => navigate(`/projects/${p.id}/reports`)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;