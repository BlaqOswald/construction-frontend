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

  // FETCH
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
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">Subcontractors</h1>

        {/* ================= FORM (LABELS ADDED ONLY) ================= */}
        <div className="bg-white p-4 shadow rounded grid grid-cols-3 gap-3">

          {/* NAME */}
          <div>
            <label className="text-xs text-gray-600">Subcontractor Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* WORK */}
          <div>
            <label className="text-xs text-gray-600">Work Type</label>
            <input
              name="task_work"
              value={form.task_work}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* TOTAL COST */}
          <div>
            <label className="text-xs text-gray-600">Total Contract Cost</label>
            <input
              type="number"
              name="total_contract_cost"
              value={form.total_contract_cost}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* PAID */}
          <div>
            <label className="text-xs text-gray-600">Initial Amount Paid</label>
            <input
              type="number"
              name="amount_paid"
              value={form.amount_paid}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="text-xs text-gray-600">Payment Date</label>
            <input
              type="date"
              name="payment_date"
              value={form.payment_date}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="col-span-3">
            <label className="text-xs text-gray-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <button
            onClick={saveSub}
            className="col-span-3 bg-green-600 text-white p-2"
          >
            {editingId ? "Update Subcontractor" : "Add Subcontractor"}
          </button>

        </div>

        {/* ================= SEARCH ================= */}
        <input
          className="border p-2 mt-4 w-full"
          placeholder="Search subcontractor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ================= TABLE (UNCHANGED STYLE) ================= */}
        <table className="w-full mt-4 bg-white shadow border">

          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Work</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Paid</th>
              <th className="border p-2">Balance</th>
              <th className="border p-2">History</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t">

                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.task_work}</td>
                <td className="p-2 text-gray-600">{s.description || "—"}</td>

                <td className="p-2">{s.total_contract_cost}</td>
                <td className="p-2">{s.amount_paid}</td>
                <td className="p-2 font-bold text-blue-600">{s.balance}</td>

                {/* HISTORY */}
                <td className="p-2 text-xs">
                  {Array.isArray(s.payment_history) && s.payment_history.length > 0 ? (
                    s.payment_history.map((p: any, i: number) => (
                      <div key={i}>
                        {p.amount_paid} | {p.payment_date}
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400">No payments</span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-2">

                  <button
                    onClick={() =>
                      setPayment({
                        id: s.id,
                        amount_paid: 0,
                        payment_date: "",
                        note: "",
                      })
                    }
                    className="bg-blue-500 text-white px-2 py-1 text-xs mr-1"
                  >
                    Pay
                  </button>

                  <button
                    onClick={() => editSub(s)}
                    className="bg-gray-500 text-white px-2 py-1 text-xs mr-1"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteSub(s.id)}
                    className="bg-red-500 text-white px-2 py-1 text-xs"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {/* ================= PAYMENT ================= */}
        {payment.id && (
          <div className="mt-6 bg-white p-4 shadow rounded">

            <h2 className="font-bold mb-3">Add Payment</h2>

            <input
              type="number"
              placeholder="Amount Paid"
              value={payment.amount_paid}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  amount_paid: Number(e.target.value),
                })
              }
              className="border p-2 w-full mb-2"
            />

            <input
              type="date"
              value={payment.payment_date}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  payment_date: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />

            <textarea
              placeholder="Note"
              value={payment.note}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  note: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />

            <button
              onClick={submitPayment}
              className="bg-green-600 text-white px-4 py-2"
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