import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

const Tasks = () => {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState<any[]>([]);
  const [form, setForm] = useState({
    activity: "",
    description: "",
    workers_count: 1,
    unit_cost: 0,
    quantity: 1,
    total_cost: 0,
    status: "pending",
  });

  const fetchTasks = async () => {
    const res = await API.get(`/tasks/projects/${projectId}`);
    setTasks(res.data);
  };

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const updated: any = {
      ...form,
      [name]:
        name === "activity" || name === "description" || name === "status"
          ? value
          : Number(value),
    };

    updated.total_cost =
      Number(updated.unit_cost) * Number(updated.quantity);

    setForm(updated);
  };

  const addTask = async () => {
    await API.post("/tasks", { ...form, project_id: projectId });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <MainLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">Tasks</h1>

        {/* FORM */}
        <div className="bg-white p-4 shadow rounded grid grid-cols-3 gap-3">

          <input name="activity" placeholder="Activity" onChange={handleChange} className="border p-2" />
          <input name="description" placeholder="Description" onChange={handleChange} className="border p-2" />

          <input type="number" name="workers_count" placeholder="Workers" onChange={handleChange} className="border p-2" />
          <input type="number" name="unit_cost" placeholder="Unit Cost" onChange={handleChange} className="border p-2" />
          <input type="number" name="quantity" placeholder="Quantity" onChange={handleChange} className="border p-2" />

          <select name="status" onChange={handleChange} className="border p-2">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button onClick={addTask} className="col-span-3 bg-blue-600 text-white p-2">
            Add Task
          </button>

        </div>

        {/* TABLE */}
        <table className="w-full mt-6 bg-white shadow border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Activity</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-t">

                <td className="p-2">{t.activity}</td>
                <td className="p-2">{t.status}</td>
                <td className="p-2">{t.total_cost}</td>

                <td className="p-2">
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </MainLayout>
  );
};

export default Tasks;