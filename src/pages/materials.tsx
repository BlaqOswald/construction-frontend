import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

type Material = {
  id?: string;
  name: string;
  description?: string;
  unit_cost: number;
  quantity_used: number;
  total_cost: number;
  currency: string;
  date_received?: string;
};

const Materials = () => {
  const { projectId } = useParams();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Material>({
    name: "",
    description: "",
    unit_cost: 0,
    quantity_used: 0,
    total_cost: 0,
    currency: "UGX",
    date_received: "",
  });

  // =========================
  // FETCH MATERIALS
  // =========================
  const fetchMaterials = async () => {
    try {
      const res = await API.get(`/materials/project/${projectId}`);
      setMaterials(res.data || []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    if (projectId) fetchMaterials();
  }, [projectId]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const updated: any = {
      ...form,
      [name]:
        name === "name" ||
        name === "description" ||
        name === "currency" ||
        name === "date_received"
          ? value
          : Number(value),
    };

    updated.total_cost =
      Number(updated.unit_cost) * Number(updated.quantity_used);

    setForm(updated);
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      unit_cost: 0,
      quantity_used: 0,
      total_cost: 0,
      currency: "UGX",
      date_received: "",
    });
    setEditingId(null);
  };

  // =========================
  // SAVE (CREATE / UPDATE)
  // =========================
  const saveMaterial = async () => {
    try {
      if (!projectId) return;

      if (editingId) {
        await API.put(`/materials/${editingId}`, form);
      } else {
        await API.post("/materials", {
          ...form,
          project_id: projectId,
        });
      }

      await fetchMaterials();
      resetForm();
    } catch (err) {
      console.error("SAVE ERROR:", err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteMaterial = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this material?"))
        return;

      await API.delete(`/materials/${id}`);
      await fetchMaterials();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // =========================
  // EDIT
  // =========================
  const editMaterial = (m: Material) => {
    setForm({
      name: m.name || "",
      description: m.description || "",
      unit_cost: m.unit_cost || 0,
      quantity_used: m.quantity_used || 0,
      total_cost: m.total_cost || 0,
      currency: m.currency || "UGX",
      date_received: m.date_received || "",
    });

    setEditingId(m.id || null);
  };

  // =========================
  // SEARCH FILTER
  // =========================
  const filtered = materials.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
          Materials Management
        </h1>

        {/* FORM */}
        <div className="bg-white p-4 shadow rounded grid grid-cols-3 gap-3">

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="date_received"
            value={form.date_received}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="unit_cost"
            placeholder="Unit Cost"
            value={form.unit_cost}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="quantity_used"
            placeholder="Quantity"
            value={form.quantity_used}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="UGX">UGX</option>
            <option value="USD">USD</option>
          </select>

          <button
            onClick={saveMaterial}
            className="col-span-3 bg-blue-600 text-white p-2 rounded"
          >
            {editingId ? "Update Material" : "Add Material"}
          </button>

        </div>

        {/* SEARCH */}
        <input
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded mt-4 w-full"
        />

        {/* TABLE */}
        <div className="mt-4 bg-white shadow rounded overflow-hidden">

          <table className="w-full text-left border">

            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    No materials found
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">

                    <td className="p-2">{m.name}</td>
                    <td className="p-2">{m.quantity_used}</td>
                    <td className="p-2">{m.total_cost}</td>

                    <td className="p-2 flex gap-2">

                      <button
                        onClick={() => editMaterial(m)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMaterial(m.id!)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
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

export default Materials;