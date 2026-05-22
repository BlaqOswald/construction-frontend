import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

const statusColors: any = {
  Completed: "bg-green-100 text-green-700",
  "In Progress": "bg-blue-100 text-blue-700",
};

/**
 * UI CATEGORIES (ALWAYS VISIBLE)
 */
const uiCategories = [
  {
    name: "Land",
    suggestions: [
      "Land Acquisition",
      "Land Title",
      "Survey",
      "Legal Fees",
    ],
  },
  {
    name: "Planning & Design",
    suggestions: [
      "Architect Fees",
      "Engineering Design",
      "Drawings",
    ],
  },
  {
    name: "Permits & Approvals",
    suggestions: [
      "Building Permit",
      "Environmental Approval",
      "Inspection Fees",
    ],
  },
  {
    name: "Utility Connections",
    suggestions: [
      "Water",
      "Electricity",
      "Internet",
      "Drainage",
    ],
  },
];

const PreDevelopment = () => {
  const { projectId } = useParams();

  /**
   * BACKEND CATEGORIES
   * ONLY USED FOR category_id
   */
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  const [items, setItems] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState({
    itemName: "",
    amount: "",
    date: "",
    status: "In Progress",
  });

  /**
   * FETCH BACKEND CATEGORIES
   */
  const fetchCategories = async () => {
    try {
      const res = await API.get(
        `/predevelopment/categories/project/${projectId}`
      );

      const data = res.data?.data || res.data;

      console.log("CATEGORIES:", data);

      setDbCategories(data || []);
    } catch (err) {
      console.error("CATEGORY FETCH ERROR:", err);
    }
  };

  /**
   * FETCH ITEMS
   */
  const fetchItems = async (categoryId: number) => {
    try {
      const categoryObj = dbCategories.find(
        (c) => c.id === categoryid
      );

      if (!categoryObj) return;

      const res = await API.get(
        `/predevelopment/items/category/${categoryObj.id}`
      );

      const data = res.data?.data || res.data;

      setItems(data || []);
    } catch (err) {
      console.error("ITEM FETCH ERROR:", err);
      setItems([]);
    }
  };

  /**
   * LOAD CATEGORIES
   */
  useEffect(() => {
    if (!projectId) return;

    fetchCategories();
  }, [projectId]);

  /**
   * LOAD ITEMS WHEN CATEGORY EXPANDS
   */
  useEffect(() => {
    if (expanded && dbCategories.length > 0) {
      fetchItems(expanded);
    }
  }, [expanded, dbCategories]);

  /**
   * SAVE ITEM
   */
  const saveItem = async () => {
    try {
      if (!expanded) return;

      const categoryObj = dbCategories.find(
        (c) => c.id === expanded
      );

      if (!categoryObj) {
        console.error("Category not found");
        return;
      }

      const payload = {
        category_id: categoryObj.id,
        item_name: form.itemName,
        amount_paid: Number(form.amount || 0),
        date_paid: form.date,
        status: form.status,
      };

      console.log("SAVE PAYLOAD:", payload);

      if (editId) {
        await API.put(
          `/predevelopment/items/${editId}`,
          payload
        );
      } else {
        await API.post(
          `/predevelopment/items`,
          payload
        );
      }

      /**
       * RESET FORM
       */
      setForm({
        itemName: "",
        amount: "",
        date: "",
        status: "In Progress",
      });

      setEditId(null);

      /**
       * REFRESH ITEMS
       */
      await fetchItems(expanded);
    } catch (err: any) {
      console.error(
        "SAVE FAILED:",
        err.response?.data || err
      );
    }
  };

  /**
   * DELETE ITEM
   */
  const deleteItem = async (id: number) => {
    try {
      await API.delete(
        `/predevelopment/items/${id}`
      );

      if (expanded) {
        fetchItems(expanded);
      }
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  /**
   * EDIT ITEM
   */
  const startEdit = (item: any) => {
    setEditId(item.id);

    setForm({
      itemName: item.item_name,
      amount: item.amount_paid,
      date: item.date_paid,
      status: item.status,
    });
  };

  /**
   * CATEGORY TOTAL
   */
  const categoryTotal = (catid: number) =>
    items
      .filter(
        (i) =>
          i.category_name === catName ||
          i.category === catName
      )
      .reduce(
        (sum, i) =>
          sum + Number(i.amount_paid || 0),
        0
      );

  /**
   * OVERALL TOTAL
   */
  const overallTotal = items.reduce(
    (sum, i) =>
      sum + Number(i.amount_paid || 0),
    0
  );

  return (
    <MainLayout>
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="bg-white p-5 rounded-xl border">
          <h1 className="text-2xl font-bold">
            Pre-Development
          </h1>

          <p className="text-gray-500">
            Track all project startup costs
          </p>
        </div>

        {/* TOTAL CARD */}
        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500">
            Total Cost
          </p>

          <h2 className="text-2xl font-bold">
            UGX {overallTotal.toLocaleString()}
          </h2>
        </div>

        {/* CATEGORY LIST */}
        <div className="space-y-3">

          {uiCategories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white border rounded-xl"
            >

              {/* CATEGORY HEADER */}
              <div className="flex justify-between p-4">
                <div>
                  <h3 className="font-bold">
                    {cat.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    UGX{" "}
                    {categoryTotal(
                      cat.name
                    ).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setExpanded(
                      expanded === cat.name
                        ? null
                        : cat.name
                    )
                  }
                  className="text-blue-600"
                >
                  {expanded === cat.name
                    ? "Close"
                    : "Expand"}
                </button>
              </div>

              {/* EXPANDED SECTION */}
              {expanded === cat.name && (
                <div className="p-4 space-y-4 border-t">

                  {/* SUGGESTIONS */}
                  <div className="flex flex-wrap gap-2">
                    {cat.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() =>
                          setForm({
                            ...form,
                            itemName: s,
                          })
                        }
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* FORM */}
                  <div className="grid md:grid-cols-4 gap-2">

                    <input
                      className="border p-2"
                      placeholder="Item Name"
                      value={form.itemName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          itemName:
                            e.target.value,
                        })
                      }
                    />

                    <input
                      type="date"
                      className="border p-2"
                      value={form.date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          date: e.target.value,
                        })
                      }
                    />

                    <select
                      className="border p-2"
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status:
                            e.target.value,
                        })
                      }
                    >
                      <option>
                        In Progress
                      </option>

                      <option>
                        Completed
                      </option>
                    </select>

                    <input
                      className="border p-2"
                      placeholder="Amount"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          amount:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    onClick={saveItem}
                    className="bg-black text-white px-4 py-2"
                  >
                    {editId
                      ? "Update"
                      : "Add Item"}
                  </button>

                  {/* TABLE */}
                  <div className="mt-4">
                    <table className="w-full text-sm">

                      <thead>
                        <tr className="text-left border-b">
                          <th className="p-2">
                            Item
                          </th>

                          <th>Date</th>

                          <th>Status</th>

                          <th>Amount</th>

                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {items
                          .filter(
                            (i) =>
                              i.category_name ===
                                cat.name ||
                              i.category ===
                                cat.name
                          )
                          .map((item) => (
                            <tr
                              key={item.id}
                              className="border-b"
                            >
                              <td className="p-2">
                                {item.item_name}
                              </td>

                              <td>
                                {item.date_paid}
                              </td>

                              <td>
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    statusColors[
                                      item.status
                                    ]
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>

                              <td>
                                {
                                  item.amount_paid
                                }
                              </td>

                              <td className="space-x-2">

                                <button
                                  onClick={() =>
                                    startEdit(
                                      item
                                    )
                                  }
                                  className="text-blue-600"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    deleteItem(
                                      item.id
                                    )
                                  }
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
              )}
            </div>
          ))}

        </div>
      </div>
    </MainLayout>
  );
};

export default PreDevelopment;