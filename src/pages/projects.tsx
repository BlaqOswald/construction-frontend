import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        console.log(res.data);
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-4">Projects</h2>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Supervisor</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th> {/* 👈 NEW */}
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr key={p.id} className="border-b text-center">
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td>{p.location}</td>
              <td>{p.supervisor_id || "N/A"}</td>
              <td>{p.locked ? "Locked 🔒" : "Active ✅"}</td>
              <td>{new Date(p.created_at).toLocaleDateString()}</td>

              {/* ✅ BUTTONS INSIDE ROW */}
              <td>
                <button
                  onClick={() => navigate(`/projects/${p.id}/tasks`)}
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Tasks
                </button>

                <button
                  onClick={() => navigate(`/reports/${p.id}`)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
};

export default Projects;
