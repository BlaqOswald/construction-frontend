import { useEffect, useState } from "react";
import API from "../api";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "client",
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");

      console.log("USERS RESPONSE:", res.data);

      // SAFE NORMALIZATION (prevents .map crash)
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    try {
      await API.post("/users", form);

      fetchUsers();

      setForm({
        name: "",
        email: "",
        role: "client",
      });
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        User Management
      </h1>

      {/* CREATE USER */}
      <div className="mb-6 p-4 border rounded bg-white">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border p-2 mr-2"
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="border p-2 mr-2"
        />

        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
          className="border p-2 mr-2"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="client">Client</option>
        </select>

        <button
          onClick={createUser}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* USER LIST */}
      <div>
        {Array.isArray(users) &&
          users.map((u: any) => (
            <div
              key={u.id}
              className="border p-3 mb-2 rounded bg-white"
            >
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm">{u.email}</p>
              <p className="text-xs text-gray-500">
                {u.role}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}