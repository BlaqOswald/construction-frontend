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
      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects Dashboard</h1>

          <button
            onClick={createProject}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + New Project
          </button>
        </div>

        {/* PROJECT LIST */}
        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-white shadow p-4 rounded cursor-pointer hover:shadow-lg"
              >
                {/* PROJECT INFO */}
                <h2 className="text-lg font-bold">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.location}</p>
                <p className="text-sm">{p.type}</p>

                {/* ACTIONS */}
                <div className="mt-4 flex gap-2">

  <button
    onClick={() => navigate(`/projects/${p.id}/tasks`)}
    className="bg-blue-500 text-white px-2 py-1 rounded"
  >
    Tasks
  </button>

  <button
    onClick={() => navigate(`/projects/${p.id}/materials`)}
    className="bg-purple-500 text-white px-2 py-1 rounded"
  >
    Materials
  </button>

  <button
    onClick={() => navigate(`/projects/${p.id}/subcontractors`)}
    className="bg-orange-500 text-white px-2 py-1 rounded"
  >
    Subcontractors
  </button>

  <button
    onClick={() => navigate(`/projects/${p.id}/reports`)}
    className="bg-green-600 text-white px-2 py-1 rounded"
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
