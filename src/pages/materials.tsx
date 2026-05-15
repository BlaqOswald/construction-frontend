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
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Material>({
    name: "",
    description: "",
    unit_cost: 0,
    quantity_used: 0,
    total_cost: 0,
    currency: "UGX",
    date_received: "",
  });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/materials/project/${projectId}`);
      setMaterials(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchMaterials();
  }, [projectId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const updated: any = {
      ...form,
      [name]:
        ["name", "description", "currency", "date_received"].includes(name)
          ? value
          : Number(value),
    };

    updated.total_cost =
      Number(updated.unit_cost) * Number(updated.quantity_used);

    setForm(updated);
  };

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

  const saveMaterial = async () => {
    try {
      const payload = {
        project_id: projectId,
        ...form,
        total_cost: Number(form.unit_cost) * Number(form.quantity_used),
      };

      if (editingId) {
        await API.put(`/materials/${editingId}`, payload);
      } else {
        await API.post("/materials", payload);
      }

      await fetchMaterials();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMaterial = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this material?")) return;

    await API.delete(`/materials/${id}`);
    fetchMaterials();
  };

  const editMaterial = (m: Material) => {
    setForm({
      ...m,
      date_received: m.date_received?.split("T")[0] || "",
    });
    setEditingId(m.id || null);
  };

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-6 space-y-5">

        <h1 className="text-2xl font-bold text-gray-800">Materials</h1>

        {/* FORM */}
        <div className="bg-white p-5 shadow-md rounded-lg border grid grid-cols-3 gap-4">

          <div>
            <label className="text-sm text-gray-600">Material Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Date Received</label>
            <input
              type="date"
              name="date_received"
              value={form.date_received}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Unit Cost</label>
            <input
              type="number"
              name="unit_cost"
              value={form.unit_cost}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Quantity Used</label>
            <input
              type="number"
              name="quantity_used"
              value={form.quantity_used}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Currency</label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1"
            >
              <option value="UGX">UGX</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <button
            onClick={saveMaterial}
            disabled={!form.name}
            className="col-span-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded font-medium"
          >
            {editingId ? "Update Material" : "Add Material"}
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded w-full shadow-sm"
        />

        {/* TABLE */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th>Description</th>
                <th>Date Received</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                filtered.map((m, index) => (
                  <tr
                    key={m.id}
                    className={`border-t hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3">{m.name}</td>
                    <td>{m.description || "-"}</td>
                    <td>
                      {m.date_received
                        ? new Date(m.date_received).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{m.quantity_used}</td>
                    <td>
                      {m.currency} {Number(m.total_cost).toLocaleString()}
                    </td>
                    <td>
                      <button
                        onClick={() => editMaterial(m)}
                        className="text-blue-600 mr-3 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMaterial(m.id)}
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

export default Materials;