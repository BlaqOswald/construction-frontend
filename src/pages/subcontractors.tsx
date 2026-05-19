import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

const Subcontractors = () => {
  const { projectId } = useParams();

  const [subs, setSubs] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    task_work: "",
    description: "",
    total_contract_cost: 0,
    amount_paid: 0,
    payment_date: "",
  });

  const [payment, setPayment] = useState({
    id: "",
    amount_paid: 0,
    payment_date: "",
    note: "",
  });

  const fetchSubs = async () => {
    const res = await API.get(`/subcontractors/project/${projectId}`);
    setSubs(res.data);
  };

  useEffect(() => {
    if (projectId) fetchSubs();
  }, [projectId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "total_contract_cost" || name === "amount_paid"
          ? Number(value)
          : value,
    });
  };

  const saveSub = async () => {
    if (editingId) {
      await API.put(`/subcontractors/${editingId}`, form);
    } else {
      await API.post("/subcontractors", {
        ...form,
        project_id: projectId,
      });
    }

    fetchSubs();
    setEditingId(null);
  };

  const editSub = (s: any) => {
    setForm(s);
    setEditingId(s.id);
  };

  const deleteSub = async (id: string) => {
    await API.delete(`/subcontractors/${id}`);
    fetchSubs();
  };

  const submitPayment = async () => {
    await API.put(`/subcontractors/${payment.id}/payment`, payment);

    setPayment({
      id: "",
      amount_paid: 0,
      payment_date: "",
      note: "",
    });

    fetchSubs();
  };

  const filtered = subs.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-3 sm:p-6 space-y-4">

        <h1 className="text-xl sm:text-2xl font-bold">
          Subcontractors
        </h1>

        {/* FORM (MOBILE SAFE) */}
        <div className="bg-white p-4 shadow rounded">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

            <div>
              <label className="text-xs text-gray-600">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Work Type</label>
              <input
                name="task_work"
                value={form.task_work}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Total Cost</label>
              <input
                type="number"
                name="total_contract_cost"
                value={form.total_contract_cost}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Paid</label>
              <input
                type="number"
                name="amount_paid"
                value={form.amount_paid}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Payment Date</label>
              <input
                type="date"
                name="payment_date"
                value={form.payment_date}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs text-gray-600">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>

          </div>

          <button
            onClick={saveSub}
            className="mt-4 w-full bg-green-600 text-white p-2 rounded"
          >
            {editingId ? "Update Subcontractor" : "Add Subcontractor"}
          </button>

        </div>

        {/* SEARCH */}
        <input
          className="border p-2 w-full rounded"
          placeholder="Search subcontractor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE WRAPPER (CRITICAL FIX) */}
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="w-full min-w-[800px] text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th>Work</th>
                <th>Description</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>History</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t">

                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.task_work}</td>
                  <td className="p-2">{s.description || "—"}</td>
                  <td className="p-2">{s.total_contract_cost}</td>
                  <td className="p-2">{s.amount_paid}</td>
                  <td className="p-2 font-bold text-blue-600">{s.balance}</td>

                  <td className="p-2 text-xs">
                    {Array.isArray(s.payment_history) && s.payment_history.length > 0
                      ? s.payment_history.map((p: any, i: number) => (
                          <div key={i}>
                            {p.amount_paid} | {p.payment_date}
                          </div>
                        ))
                      : "No payments"}
                  </td>

                  <td className="p-2 space-y-1 sm:space-y-0 sm:space-x-1 flex flex-col sm:flex-row">

                    <button
                      onClick={() =>
                        setPayment({
                          id: s.id,
                          amount_paid: 0,
                          payment_date: "",
                          note: "",
                        })
                      }
                      className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Pay
                    </button>

                    <button
                      onClick={() => editSub(s)}
                      className="bg-gray-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteSub(s.id)}
                      className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* PAYMENT */}
        {payment.id && (
          <div className="bg-white p-4 shadow rounded space-y-2">

            <h2 className="font-bold">Add Payment</h2>

            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Amount"
              value={payment.amount_paid}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  amount_paid: Number(e.target.value),
                })
              }
            />

            <input
              type="date"
              className="border p-2 w-full"
              value={payment.payment_date}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  payment_date: e.target.value,
                })
              }
            />

            <textarea
              className="border p-2 w-full"
              placeholder="Note"
              value={payment.note}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  note: e.target.value,
                })
              }
            />

            <button
              onClick={submitPayment}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Submit Payment
            </button>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Subcontractors;