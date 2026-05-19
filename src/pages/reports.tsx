import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

const Reports = () => {
  const { projectId } = useParams();

  const [report, setReport] = useState<any>(null);
  const [month, setMonth] = useState("");

  const fetchReport = async (selectedMonth = "") => {
    try {
      const url = selectedMonth
        ? `/reports/${projectId}?month=${selectedMonth}`
        : `/reports/${projectId}`;

      const res = await API.get(url);
      setReport(res.data);
    } catch (err) {
      console.error("REPORT ERROR:", err);
    }
  };

  useEffect(() => {
    if (projectId) fetchReport();
  }, [projectId]);

  const handleMonthChange = (value: string) => {
    setMonth(value);
    fetchReport(value);
  };

  if (!report) {
    return (
      <MainLayout>
        <div className="p-4 sm:p-8">
          <div className="bg-white shadow rounded-xl p-6 sm:p-8 text-center">
            Loading Project Report...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen space-y-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 print:hidden">

          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
              Project Report
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Construction analytics & cost tracking
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            <select
              className="border px-3 py-2 rounded-lg w-full sm:w-auto"
              value={month}
              onChange={(e) => handleMonthChange(e.target.value)}
            >
              <option value="">Full Report</option>
              <option value="2026-01">Jan 2026</option>
              <option value="2026-02">Feb 2026</option>
              <option value="2026-03">Mar 2026</option>
              <option value="2026-04">Apr 2026</option>
            </select>

            <button
              onClick={() => window.print()}
              className="bg-black text-white px-4 py-2 rounded-lg w-full sm:w-auto"
            >
              Print / PDF
            </button>

          </div>
        </div>

        {/* SUMMARY (FIXED GRID) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">

          <Card title="Total Tasks" value={report.summary.totalTasks} />
          <Card title="Completed" value={report.summary.completedTasks} />
          <Card title="Pending" value={report.summary.pendingTasks} />
          <Card title="In Progress" value={report.summary.inProgressTasks} />
          <Card title="Completion %" value={`${report.summary.completionRate}%`} />
          <Card title="Task Cost" value={report.summary.taskCost} />
          <Card title="Material Cost" value={report.summary.materialCost} />
          <Card title="Sub Cost" value={report.summary.subcontractorCost} />
          <Card title="Total Cost" value={report.summary.totalProjectCost} />

        </div>

        {/* TASKS */}
        <Section title="Task Breakdown">
          <TableWrapper>
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <Th>Task</Th>
                  <Th>Status</Th>
                  <Th>Start</Th>
                  <Th>End</Th>
                  <Th>Days</Th>
                  <Th>Cost</Th>
                </tr>
              </thead>

              <tbody>
                {report.tasks?.map((t: any) => (
                  <tr key={t.id} className="border-t">
                    <Td>{t.activity}</Td>
                    <Td>{t.status}</Td>
                    <Td>{t.start_date || "—"}</Td>
                    <Td>{t.end_date || "—"}</Td>
                    <Td>{t.daysTaken || 0}</Td>
                    <Td>{t.total_cost}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </Section>

        {/* SUBCONTRACTORS */}
        <Section title="Subcontractors">
          <TableWrapper>
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <Th>Name</Th>
                  <Th>Cost</Th>
                </tr>
              </thead>
              <tbody>
                {report.subcontractors?.map((s: any) => (
                  <tr key={s.id}>
                    <Td>{s.name}</Td>
                    <Td>{s.total_contract_cost}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </Section>

        {/* MATERIALS */}
        <Section title="Materials">
          <TableWrapper>
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <Th>Name</Th>
                  <Th>Qty</Th>
                  <Th>Unit</Th>
                  <Th>Total</Th>
                </tr>
              </thead>
              <tbody>
                {report.materials?.map((m: any) => (
                  <tr key={m.id}>
                    <Td>{m.name}</Td>
                    <Td>{m.quantity_used}</Td>
                    <Td>{m.unit_cost}</Td>
                    <Td>{m.total_cost}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </Section>

      </div>
    </MainLayout>
  );
};

export default Reports;

/* ================= COMPONENTS ================= */

const Card = ({ title, value }: any) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border">
    <p className="text-xs sm:text-sm text-gray-500">{title}</p>
    <p className="text-lg sm:text-2xl font-bold">{value}</p>
  </div>
);

const Section = ({ title, children }: any) => (
  <div className="bg-white rounded-xl shadow border overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b font-semibold">
      {title}
    </div>
    <div className="p-3 sm:p-5">{children}</div>
  </div>
);

const TableWrapper = ({ children }: any) => (
  <div className="overflow-x-auto">{children}</div>
);

const Th = ({ children }: any) => (
  <th className="text-left px-3 py-2 text-gray-700 whitespace-nowrap">
    {children}
  </th>
);

const Td = ({ children }: any) => (
  <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
    {children}
  </td>
);