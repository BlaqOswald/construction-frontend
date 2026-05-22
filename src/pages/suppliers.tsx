// Suppliers.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

const Suppliers = () => {
  const { projectId } = useParams();

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [activeSupplier, setActiveSupplier] =
    useState<string | null>(null);

  const [mode, setMode] =
    useState<"delivery" | "payment" | null>(
      null
    );

  const [showSupplierForm, setShowSupplierForm] =
    useState(false);

  const [editItem, setEditItem] =
    useState<any>(null);

  // SUPPLIER FORM
  const [supplierForm, setSupplierForm] =
    useState({
      name: "",
      location: "",
      contact: "",
    });

  // DELIVERY FORM
  const [deliveryForm, setDeliveryForm] =
    useState<any>({
      supplier_id: "",
      item_name: "",
      quantity: 0,
      unit_cost: 0,
      total_cost: 0,
      invoice_number: "",
      payment_status: "Unpaid",
      date_sent: "",
    });

  // PAYMENT FORM
  const [paymentForm, setPaymentForm] =
    useState<any>({
      supplier_id: "",
      amount_paid: 0,
      payment_date: "",
      note: "",
    });

  // FETCH
  const fetchSuppliers = async () => {
    const res = await API.get(
      `/suppliers/project/${projectId}`
    );

    setSuppliers(res.data);
  };

  useEffect(() => {
    if (projectId) {
      fetchSuppliers();
    }
  }, [projectId]);

  // ======================
  // ADD SUPPLIER
  // ======================
  const addSupplier = async () => {
    await API.post("/suppliers", {
      ...supplierForm,
      project_id: projectId,
    });

    setSupplierForm({
      name: "",
      location: "",
      contact: "",
    });

    setShowSupplierForm(false);

    fetchSuppliers();
  };

  // ======================
  // DELETE SUPPLIER
  // ======================
  const deleteSupplier = async (
    id: string
  ) => {
    await API.delete(`/suppliers/${id}`);

    fetchSuppliers();
  };

  // ======================
  // ADD DELIVERY
  // ======================
  const addDelivery = async () => {
    await API.post(
      "/suppliers/delivery",
      {
        ...deliveryForm,
        total_cost:
          Number(deliveryForm.quantity) *
          Number(deliveryForm.unit_cost),
      }
    );

    setDeliveryForm({
      supplier_id: "",
      item_name: "",
      quantity: 0,
      unit_cost: 0,
      total_cost: 0,
      invoice_number: "",
      payment_status: "Unpaid",
      date_sent: "",
    });

    setMode(null);

    setActiveSupplier(null);

    fetchSuppliers();
  };

  // ======================
  // BULK PAYMENT
  // ======================
  const addPayment = async () => {
  await API.post("/suppliers/payment/bulk", {
    ...paymentForm,
    supplier_id: activeSupplier, // IMPORTANT FIX
  });

  setPaymentForm({
    supplier_id: "",
    amount_paid: 0,
    payment_date: "",
    note: "",
  });

  setMode(null);
  setActiveSupplier(null);
  fetchSuppliers();
};

  // ======================
  // DELETE DELIVERY
  // ======================
  const deleteDelivery = async (
    id: string
  ) => {
    await API.delete(
      `/suppliers/delivery/${id}`
    );

    fetchSuppliers();
  };

  // FILTER
  const filtered = suppliers.filter((s) =>
    s.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-4 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Suppliers Ledger
          </h1>

          <button
            onClick={() =>
              setShowSupplierForm(
                !showSupplierForm
              )
            }
            className="
bg-black
text-white
px-4
py-2
rounded-lg
font-medium
shadow-sm
hover:bg-gray-400
hover:shadow-md
transition-all
duration-200
active:scale-[0.98]
"
          >
             New Supplier
          </button>
        </div>

        {/* SUPPLIER FORM */}
        {showSupplierForm && (
          <div className="bg-white p-4 rounded shadow space-y-2">

            <input
              placeholder="Supplier Name"
              className="border p-2 w-full rounded"
              onChange={(e) =>
                setSupplierForm({
                  ...supplierForm,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Location"
              className="border p-2 w-full rounded"
              onChange={(e) =>
                setSupplierForm({
                  ...supplierForm,
                  location:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Contact"
              className="border p-2 w-full rounded"
              onChange={(e) =>
                setSupplierForm({
                  ...supplierForm,
                  contact:
                    e.target.value,
                })
              }
            />

            <button
              onClick={addSupplier}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              Save Supplier
            </button>

          </div>
        )}

        {/* SEARCH */}
        <input
          className="border p-2 w-full rounded"
          placeholder="Search supplier..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* EMPTY */}
        {!filtered.length && (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            <p className="font-semibold">
              No suppliers found
            </p>

            <p className="text-sm">
              Add suppliers to start
              tracking deliveries &
              payments
            </p>
          </div>
        )}

        {/* SUPPLIERS */}
        {filtered.map((s) => {

          const totalSupplied =
            s.deliveries?.reduce(
              (
                a: number,
                d: any
              ) =>
                a +
                Number(
                  d.total_cost
                ),
              0
            ) || 0;

          const totalPaid =
            s.payments?.reduce(
              (
                a: number,
                p: any
              ) =>
                a +
                Number(
                  p.amount_paid
                ),
              0
            ) || 0;

          const balance =
            totalSupplied -
            totalPaid;

          return (
            <div
              key={s.id}
              className="bg-white shadow rounded p-5 space-y-5"
            >

              {/* HEADER */}
              <div className="flex justify-between">

                <div>
                  <h2 className="text-xl font-bold">
                    {s.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {s.location} •{" "}
                    {s.contact}
                  </p>
                </div>

                <div className="flex gap-2">

                  {/* NEW ITEMS */}
                  <button
                    onClick={() => {
                      setActiveSupplier(
                        s.id
                      );

                      setMode(
                        "delivery"
                      );

                      setDeliveryForm({
                        supplier_id:
                          s.id,
                        item_name:
                          "",
                        quantity: 0,
                        unit_cost: 0,
                        total_cost: 0,
                        invoice_number:
                          "",
                        payment_status:
                          "Unpaid",
                        date_sent:
                          "",
                      });
                    }}
                   className="
bg-blue-600 text-white
px-3 py-1.5
text-sm
rounded-md
font-medium
shadow-sm
hover:bg-blue-700
transition-all
"
                  >
                     New Items
                  </button>

                  {/* BULK PAYMENT */}
                  <button
                    onClick={() => {
                      setActiveSupplier(
                        s.id
                      );

                      setMode(
                        "payment"
                      );

                      setPaymentForm({
                        supplier_id:
                          s.id,
                        amount_paid: 0,
                        payment_date:
                          "",
                        note: "",
                      });
                    }}
                    className="
bg-green-400
text-white
px-3
py-1.5
rounded-lg
font-medium
shadow-sm
hover:bg-green-400
hover:shadow-md
transition-all
duration-200
active:scale-[0.98]
"
                  >
                     Bulk Payment
                  </button>

                  {/* DELETE SUPPLIER */}
                  <button
                    onClick={() =>
                      deleteSupplier(
                        s.id
                      )
                    }
                    className="
bg-red-400
text-white
px-3
py-1.5
rounded-lg
font-medium
shadow-sm
hover:bg-red-400
hover:shadow-md
transition-all
duration-200
active:scale-[0.98]
"
                  >
                     Delete
                  </button>

                </div>
              </div>

              {/* SUMMARY */}
              <div className="grid grid-cols-3 bg-gray-50 p-3 rounded">

                <div>
                  <p>Total Materials</p>

                  <p className="font-bold">
                    {totalSupplied}
                  </p>
                </div>

                <div>
                  <p>Total Paid</p>

                  <p className="font-bold text-green-600">
                    {totalPaid}
                  </p>
                </div>

                <div>
                  <p>Balance</p>

                  <p className="font-bold text-blue-600">
                    {balance}
                  </p>
                </div>

              </div>

              {/* DELIVERY FORM */}
              {activeSupplier ===
                s.id &&
                mode ===
                  "delivery" && (
                  <div className="bg-blue-50 p-3 rounded space-y-2">

                    <input
                      placeholder="Item Name"
                      className="border p-2 w-full rounded"
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          item_name:
                            e.target
                              .value,
                        })
                      }
                    />

                    <div className="grid grid-cols-2 gap-2">

                      <input
                        type="number"
                        placeholder="Qty"
                        className="border p-2 rounded"
                        onChange={(e) =>
                          setDeliveryForm(
                            {
                              ...deliveryForm,
                              quantity:
                                Number(
                                  e
                                    .target
                                    .value
                                ),
                            }
                          )
                        }
                      />

                      <input
                        type="number"
                        placeholder="Unit Cost"
                        className="border p-2 rounded"
                        onChange={(e) =>
                          setDeliveryForm(
                            {
                              ...deliveryForm,
                              unit_cost:
                                Number(
                                  e
                                    .target
                                    .value
                                ),
                            }
                          )
                        }
                      />

                    </div>

                    <input
                      placeholder="Invoice No."
                      className="border p-2 w-full rounded"
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          invoice_number:
                            e.target
                              .value,
                        })
                      }
                    />

                    <select
                      className="border p-2 w-full rounded"
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          payment_status:
                            e.target
                              .value,
                        })
                      }
                    >
                      <option>
                        Unpaid
                      </option>

                      <option>
                        Partial
                      </option>

                      <option>
                        Paid
                      </option>
                    </select>

                    <input
                      type="date"
                      className="border p-2 w-full rounded"
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          date_sent:
                            e.target
                              .value,
                        })
                      }
                    />

                    <button
                      onClick={
                        addDelivery
                      }
                      className="bg-blue-600 text-white w-full py-2 rounded"
                    >
                      Save Delivery
                    </button>

                  </div>
                )}

              {/* PAYMENT FORM */}
              {activeSupplier ===
                s.id &&
                mode ===
                  "payment" && (
                  <div className="bg-green-50 p-3 rounded space-y-2">

                    <input
                      type="number"
                      placeholder="Amount Paid"
                      className="border p-2 w-full rounded"
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          amount_paid:
                            Number(
                              e.target
                                .value
                            ),
                        })
                      }
                    />

                    <input
                      type="date"
                      className="border p-2 w-full rounded"
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          payment_date:
                            e.target
                              .value,
                        })
                      }
                    />

                    <textarea
                      placeholder="Note"
                      className="border p-2 w-full rounded"
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          note: e.target
                            .value,
                        })
                      }
                    />

                    <button
                      onClick={
                        addPayment
                      }
                      className="bg-green-600 text-white w-full py-2 rounded"
                    >
                      Save Payment
                    </button>

                  </div>
                )}

              {/* TABLE */}
              <div className="overflow-x-auto">

                <table className="w-full text-sm border">

                  <thead className="bg-gray-100">

                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Invoice No.</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>
                        Payment
                        Date/Amount
                      </th>
                      <th>Balance</th>
                      <th>
                        Delivery Date
                      </th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {(s.deliveries ||
                      []).map(
                      (
                        d: any,
                        i: number
                      ) => {

                        const paid =
                          (
                            s.payments ||
                            []
                          )
                            .filter(
                              (
                                p: any
                              ) =>
                                p.delivery_id ===
                                d.id
                            )
                            .reduce(
                              (
                                a: number,
                                p: any
                              ) =>
                                a +
                                Number(
                                  p.amount_paid
                                ),
                              0
                            );

                        const balanceRow =
                          Number(
                            d.total_cost
                          ) - paid;

                        return (
                          <tr
                            key={i}
                            className="border-t"
                          >

                            <td className="p-2">
                              {
                                d.item_name
                              }
                            </td>

                            <td className="p-2">
                              {
                                d.quantity
                              }
                            </td>

                            <td className="p-2">
                              {
                                d.invoice_number
                              }
                            </td>

                            <td className="p-2">
                              {
                                d.total_cost
                              }
                            </td>

                            <td className="p-2">
                              {
                                d.payment_status
                              }
                            </td>

                            <td className="p-2">

                              {(
                                s.payments ||
                                []
                              )
                                .filter(
                                  (
                                    p: any
                                  ) =>
                                    p.delivery_id ===
                                    d.id
                                )
                                .map(
                                  (
                                    p: any
                                  ) => (
                                    <div
                                      key={
                                        p.id
                                      }
                                    >
                                      {
                                        p.payment_date
                                      }{" "}
                                      -{" "}
                                      {
                                        p.amount_paid
                                      }
                                    </div>
                                  )
                                )}

                            </td>

                            <td className="p-2">
                              {
                                balanceRow
                              }
                            </td>

                            <td className="p-2">
                              {
                                d.date_sent
                              }
                            </td>

                            <td className="p-2 space-x-2">

                              {/* PAY */}
                              <button
                                className="text-blue-600"
                                onClick={async () => {

                                  const amount =
                                    prompt(
                                      "Enter amount"
                                    );

                                  if (
                                    !amount
                                  )
                                    return;

                                  const date =
                                    prompt(
                                      "Enter payment date YYYY-MM-DD"
                                    );

                                  if (
                                    !date
                                  )
                                    return;

                                  await API.post(
                                    "/suppliers/delivery/pay",
                                    {
                                      supplier_id:
                                        s.id,
                                      delivery_id:
                                        d.id,
                                      amount_paid:
                                        Number(
                                          amount
                                        ),
                                      payment_date:
                                        date,
                                    }
                                  );

                                  fetchSuppliers();
                                }}
                              >
                                Pay
                              </button>

                              {/* EDIT */}
                              <button
                                className="text-gray-600"
                                onClick={() =>
                                  setEditItem(
                                    d
                                  )
                                }
                              >
                                Edit
                              </button>

                              {/* DELETE */}
                              <button
                                className="text-red-600"
                                onClick={() =>
                                  deleteDelivery(
                                    d.id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

              {/* EDIT FORM */}
              {editItem && (
                <div className="bg-yellow-50 p-4 rounded space-y-2">

                  <input
                    value={
                      editItem.item_name
                    }
                    className="border p-2 w-full rounded"
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        item_name:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    type="number"
                    value={
                      editItem.quantity
                    }
                    className="border p-2 w-full rounded"
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        quantity:
                          Number(
                            e.target
                              .value
                          ),
                      })
                    }
                  />

                  <input
                    type="number"
                    value={
                      editItem.unit_cost
                    }
                    className="border p-2 w-full rounded"
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        unit_cost:
                          Number(
                            e.target
                              .value
                          ),
                      })
                    }
                  />

                  <input
                    value={
                      editItem.invoice_number
                    }
                    className="border p-2 w-full rounded"
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        invoice_number:
                          e.target
                            .value,
                      })
                    }
                  />

                  <button
                    className="bg-black text-white px-4 py-2 rounded"
                    onClick={async () => {

                      await API.put(
                        `/suppliers/delivery/${editItem.id}`,
                        editItem
                      );

                      setEditItem(
                        null
                      );

                      fetchSuppliers();
                    }}
                  >
                    Save Changes
                  </button>

                </div>
              )}

            </div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Suppliers;