import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

const Subcontractors = () => {
  const { projectId } = useParams();

  const [subs, setSubs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    task_work: "",
    description: "",
    total_contract_cost: 0,
    amount_paid: 0,
    payment_date: "",
  });

  const fetchSubs = async () => {
    const res = await API.get(`/subcontractors/project/${projectId}`);
    setSubs(res.data);
  };

  useEffect(() => {
    if (projectId) fetchSubs();
  }, [projectId]);

  const addSub = async () => {
    await API.post("/subcontractors", {
      ...form,
      project_id: projectId,
    });

    fetchSubs();
  };

  const deleteSub = async (id: string) => {
    await API.delete(`/subcontractors/${id}`);
    fetchSubs();
  };

  const filtered = subs.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">Subcontractors</h1>

        {/* FORM */}
        <div className="bg-white p-4 shadow rounded grid grid-cols-3 gap-3">

          <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2" />
          <input placeholder="Work" onChange={(e) => setForm({ ...form, task_work: e.target.value })} className="border p-2" />
          <input type="date" onChange={(e) => setForm({ ...form, payment_date: e.target.value })} className="border p-2" />

          <input type="number" placeholder="Total Cost" onChange={(e) => setForm({ ...form, total_contract_cost: Number(e.target.value) })} className="border p-2" />
          <input type="number" placeholder="Paid" onChange={(e) => setForm({ ...form, amount_paid: Number(e.target.value) })} className="border p-2" />

          <textarea placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-2 col-span-3" />

          <button onClick={addSub} className="col-span-3 bg-green-600 text-white p-2">
            Add Subcontractor
          </button>

        </div>

        {/* SEARCH */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mt-4 w-full"
        />

        {/* TABLE */}
        <table className="w-full mt-4 bg-white shadow border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Work</th>
              <th className="border p-2">Cost</th>
              <th className="border p-2">Paid</th>
              <th className="border p-2">Balance</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t">

                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.task_work}</td>
                <td className="p-2">{s.total_contract_cost}</td>
                <td className="p-2">{s.amount_paid}</td>
                <td className="p-2">{s.balance}</td>

                <td className="p-2">
                  <button
                    onClick={() => deleteSub(s.id)}
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

export default Subcontractors;