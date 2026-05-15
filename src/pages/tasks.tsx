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

  // FETCH TASKS
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

  // HANDLE INPUT
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

  // RESET FORM
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

  // SAVE TASK
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

  // EDIT TASK
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

  // DELETE TASK
  const deleteTask = async (id: string) => {
    try {
      if (!window.confirm("Delete this task?")) return;

      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("DELETE TASK ERROR:", err);
    }
  };

  // FILTER
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
      <div className="p-6 space-y-5">

        <h1 className="text-2xl font-bold text-gray-800">
          Tasks
        </h1>

        {/* SEARCH */}
        <input
          className="border p-3 rounded w-full shadow-sm"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FORM */}
        <div className="bg-white p-5 shadow-md rounded-lg border grid grid-cols-3 gap-4">

          <div>
            <label className="text-sm text-gray-600">
              Activity
            </label>
            <input
              name="activity"
              value={form.activity}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Description
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              End Date
            </label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Workers Count
            </label>
            <input
              type="number"
              name="workers_count"
              value={form.workers_count}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Unit Cost
            </label>
            <input
              type="number"
              name="unit_cost"
              value={form.unit_cost}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Status
            </label>
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

          <div>
            <label className="text-sm text-gray-600">
              Auto Total Cost
            </label>
            <input
              value={`UGX ${Number(form.total_cost).toLocaleString()}`}
              disabled
              className="border p-2 rounded w-full mt-1 bg-gray-100"
            />
          </div>

          <button
            onClick={saveTask}
            disabled={!form.activity}
            className="col-span-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded font-medium"
          >
            {editingId ? "Update Task" : "Add Task"}
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Activity</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Total Cost</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-gray-500"
                  >
                    Loading tasks...
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-gray-500"
                  >
                    No tasks found
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t, index) => (
                  <tr
                    key={t.id}
                    className={`border-t hover:bg-gray-50 ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3 font-medium">
                      {t.activity}
                    </td>

                    <td>{t.description || "-"}</td>

                    <td>
                      {t.start_date
                        ? new Date(
                            t.start_date
                          ).toLocaleDateString("en-GB")
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          t.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : t.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="font-medium text-green-700">
                      UGX{" "}
                      {Number(t.total_cost).toLocaleString()}
                    </td>

                    <td>
                      <button
                        onClick={() => editTask(t)}
                        className="text-blue-600 font-medium mr-3"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTask(t.id)}
                        className="text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tasks;