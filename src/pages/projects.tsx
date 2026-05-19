import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

type Project = {
  id: string;
  name: string;
  type: string;
  location: string;
  locked?: boolean;
  created_at?: string;
};

type ProjectForm = {
  name: string;
  type: string;
  location: string;
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [form, setForm] = useState<ProjectForm>({
    name: "",
    type: "",
    location: "",
  });

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await API.get<Project[]>("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const saveProject = async () => {
    try {
      let res: any;

      if (editingId) {
        res = await API.put(`/projects/${editingId}`, form);

        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingId ? res.data : p
          )
        );
      } else {
        res = await API.post("/projects", form);

        setProjects((prev) => [res.data, ...prev]);
      }

      setForm({ name: "", type: "", location: "" });
      setEditingId(null);
      setOpenMenu(null);
    } catch (err) {
      console.error("SAVE ERROR:", err);
    }
  };

  const editProject = (project: Project) => {
    setForm({
      name: project.name,
      type: project.type,
      location: project.location,
    });

    setEditingId(project.id);
    setOpenMenu(null);
  };

  const deleteProject = async (id: string) => {
    try {
      if (!window.confirm("Delete this project?")) return;

      await API.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setOpenMenu(null);
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <MainLayout>
      <div className="p-3 sm:p-6 space-y-6">

        {/* HEADER */}
        <h2 className="text-xl sm:text-2xl font-bold">
          Projects
        </h2>

        {/* FORM (UNCHANGED STRUCTURE) */}
        <div className="bg-white p-4 shadow rounded">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

            <input
              placeholder="Project Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Type"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <button
            onClick={saveProject}
            className="mt-3 w-full bg-blue-600 text-white p-2 rounded"
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>
        </div>

        {/* TABLE FIX (IMPORTANT PART) */}
        <div className="bg-white shadow rounded overflow-x-auto">

          <table className="w-full min-w-[700px] text-sm">

            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Created</th>
                <th>Menu</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b text-center">

                  <td className="p-3 text-left">{p.name}</td>
                  <td>{p.type}</td>
                  <td>{p.location}</td>
                  <td>
                    {p.locked ? "Locked 🔒" : "Active ✅"}
                  </td>
                  <td>
                    {p.created_at
                      ? new Date(p.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="relative">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === p.id ? null : p.id)
                      }
                      className="text-xl px-3"
                    >
                      ⋮
                    </button>

                    {openMenu === p.id && (
                      <div className="absolute right-0 z-50 w-40 bg-white border shadow rounded">

                        <button
                          onClick={() => navigate(`/projects/${p.id}/tasks`)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Tasks
                        </button>

                        <button
                          onClick={() => navigate(`/projects/${p.id}/reports`)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Report
                        </button>

                        <button
                          onClick={() => editProject(p)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProject(p.id)}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>

                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </MainLayout>
  );
};

export default Projects;