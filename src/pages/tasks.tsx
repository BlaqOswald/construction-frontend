import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

const Tasks = () => {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    activity: "",
    description: "",
    workers_count: 1,
    unit_cost: 0,
    quantity: 1,
    total_cost: 0,
    status: "pending",
    start_date: "",
    end_date: "",
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/tasks/project/${projectId}`);
      setTasks(res.data || []);
    } catch (err) {
      console.error("FETCH TASK ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const updated: any = {
      ...form,
      [name]:
        name === "activity" ||
        name === "description" ||
        name === "status" ||
        name === "start_date" ||
        name === "end_date"
          ? value
          : Number(value),
    };

    updated.total_cost =
      Number(updated.unit_cost) * Number(updated.quantity);

    setForm(updated);
  };

  const reset = () => {
    setForm({
      activity: "",
      description: "",
      workers_count: 1,
      unit_cost: 0,
      quantity: 1,
      total_cost: 0,
      status: "pending",
      start_date: "",
      end_date: "",
    });

    setEditingId(null);
  };

  const saveTask = async () => {
    try {
      const payload = {
        ...form,
        project_id: projectId,
        total_cost:
          Number(form.unit_cost) * Number(form.quantity),
      };

      if (editingId) {
        await API.put(`/tasks/${editingId}`, payload);
      } else {
        await API.post("/tasks", payload);
      }

      await fetchTasks();
      reset();
    } catch (err) {
      console.error("SAVE TASK ERROR:", err);
    }
  };

  const editTask = (t: any) => {
    setForm({
      activity: t.activity || "",
      description: t.description || "",
      workers_count: t.workers_count || 1,
      unit_cost: t.unit_cost || 0,
      quantity: t.quantity || 1,
      total_cost: t.total_cost || 0,
      status: t.status || "pending",
      start_date: t.start_date?.split("T")[0] || "",
      end_date: t.end_date?.split("T")[0] || "",
    });

    setEditingId(t.id);
  };

  const deleteTask = async (id: string) => {
    try {
      if (!window.confirm("Delete this task?")) return;
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("DELETE TASK ERROR:", err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.activity?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.status?.toLowerCase().includes(q)
    );
  });

  return (
    <MainLayout>
      <div className="p-3 sm:p-6 space-y-5">

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Tasks
        </h1>

        {/* SEARCH */}
        <input
          className="border p-2 sm:p-3 rounded w-full shadow-sm"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FORM */}
        <div className="bg-white p-4 sm:p-5 shadow-md rounded-lg border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {[
            ["activity", "Activity"],
            ["description", "Description"],
            ["start_date", "Start Date"],
            ["end_date", "End Date"],
            ["workers_count", "Workers"],
            ["unit_cost", "Unit Cost"],
            ["quantity", "Quantity"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs text-gray-600">{label}</label>
              <input
                name={key}
                value={(form as any)[key]}
                onChange={handleChange}
                type={
                  key.includes("date")
                    ? "date"
                    : key !== "activity" && key !== "description"
                    ? "number"
                    : "text"
                }
                className="border p-2 rounded w-full mt-1"
              />
            </div>
          ))}

          {/* STATUS */}
          <div>
            <label className="text-xs text-gray-600">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* TOTAL */}
          <div>
            <label className="text-xs text-gray-600">Total Cost</label>
            <input
              disabled
              value={`UGX ${Number(form.total_cost).toLocaleString()}`}
              className="border p-2 rounded w-full mt-1 bg-gray-100"
            />
          </div>

          <button
            onClick={saveTask}
            className="col-span-1 sm:col-span-2 lg:col-span-3 bg-blue-600 text-white p-3 rounded"
          >
            {editingId ? "Update Task" : "Add Task"}
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Activity</th>
                <th>Description</th>
                <th>Status</th>
                <th>Total Cost</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Loading tasks...
                  </td>
                </tr>
              ) : filteredTasks.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3 font-medium">{t.activity}</td>
                  <td>{t.description || "-"}</td>
                  <td>{t.status}</td>
                  <td>UGX {Number(t.total_cost).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => editTask(t)}
                      className="text-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
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

export default Tasks;