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
          <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Loading Project Report...
            </h2>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 sm:mb-8 print:hidden">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Project Report
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Construction project analytics, expenses and progress
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="border border-gray-300 px-3 py-2 rounded-lg bg-white shadow-sm focus:outline-none w-full sm:w-auto"
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
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
            >
              Print / PDF
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <Card title="Total Tasks" value={report.summary.totalTasks} />
          <Card title="Completed" value={report.summary.completedTasks} />
          <Card title="Pending" value={report.summary.pendingTasks} />
          <Card title="In Progress" value={report.summary.inProgressTasks} />
          <Card title="Completion %" value={`${report.summary.completionRate}%`} />
          <Card title="Task Cost" value={report.summary.taskCost} />
          <Card title="Material Cost" value={report.summary.materialCost} />
          <Card title="Subcontractor Cost" value={report.summary.subcontractorCost} />
          <Card title="Total Cost" value={report.summary.totalProjectCost} />
        </div>

        {/* TASKS */}
        <Section title="Task Breakdown">
          <TableWrapper>
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <Th>Task</Th>
                  <Th>Status</Th>
                  <Th>Start Date</Th>
                  <Th>End Date</Th>
                  <Th>Days</Th>
                  <Th>Cost</Th>
                </tr>
              </thead>
              <tbody>
                {report.tasks?.map((t: any) => (
                  <tr key={t.id} className="hover:bg-gray-50">
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
            <table className="w-full min-w-[500px] text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <Th>Name</Th>
                  <Th>Contract Cost</Th>
                </tr>
              </thead>
              <tbody>
                {report.subcontractors?.map((s: any) => (
                  <tr key={s.id} className="hover:bg-gray-50">
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
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <Th>Name</Th>
                  <Th>Qty</Th>
                  <Th>Unit Cost</Th>
                  <Th>Total Cost</Th>
                </tr>
              </thead>
              <tbody>
                {report.materials?.map((m: any) => (
                  <tr key={m.id} className="hover:bg-gray-50">
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

/* ================= UI COMPONENTS ================= */

const Card = ({ title, value }: any) => (
  <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 sm:p-5">
    <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">{title}</h3>
    <p className="text-lg sm:text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const Section = ({ title, children }: any) => (
  <div className="mb-6 sm:mb-8 bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
    <div className="border-b px-4 sm:px-5 py-3 sm:py-4 bg-gray-50">
      <h2 className="font-semibold text-base sm:text-lg text-gray-700">{title}</h2>
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

const TableWrapper = ({ children }: any) => (
  <div className="overflow-x-auto">
    {children}
  </div>
);

const Th = ({ children }: any) => (
  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700 border-b whitespace-nowrap">
    {children}
  </th>
);

const Td = ({ children }: any) => (
  <td className="px-3 sm:px-4 py-2 sm:py-3 border-b text-gray-700 whitespace-nowrap">
    {children}
  </td>
);