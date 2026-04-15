import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import MainLayout from "../layouts/MainLayout";

const Reports = () => {
  const { projectId } = useParams();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const res = await API.get(`/reports/${projectId}`);
      setReport(res.data);
    };

    if (projectId) fetchReport();
  }, [projectId]);

  if (!report) return <MainLayout>Loading...</MainLayout>;

  return (
    <MainLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
          Construction Project Report
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <Card title="Total Tasks" value={report.summary.totalTasks} />
          <Card title="Completed" value={report.summary.completedTasks} />
          <Card title="In Progress" value={report.summary.inProgressTasks} />

          <Card title="Material Cost" value={report.summary.materialCost} />
          <Card title="Subcontractor Cost" value={report.summary.subcontractorCost} />
          <Card title="Total Cost" value={report.summary.totalProjectCost} />

          <Card title="Completion Rate" value={`${report.summary.completionRate}%`} />

        </div>

        {/* INSIGHTS */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <Insight
            title="Most Expensive Task"
            value={report.insights.mostExpensiveTask?.activity}
          />

          <Insight
            title="Highest Material Usage"
            value={report.insights.highestMaterialTask?.activity}
          />

        </div>

        {/* TASK BREAKDOWN */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-bold mb-3">Task Breakdown</h2>

          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Material</th>
                <th>Subcontractor</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {report.tasks.map((t: any) => (
                <tr key={t.id}>
                  <td>{t.activity}</td>
                  <td>{t.status}</td>
                  <td>{t.materialCost}</td>
                  <td>{t.subCost}</td>
                  <td>{t.taskCost}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </MainLayout>
  );
};

export default Reports;

/* SMALL UI COMPONENTS */
const Card = ({ title, value }: any) => (
  <div className="bg-white shadow rounded p-4">
    <h3 className="text-gray-500">{title}</h3>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const Insight = ({ title, value }: any) => (
  <div className="bg-blue-50 p-4 rounded">
    <h3 className="font-semibold">{title}</h3>
    <p>{value || "N/A"}</p>
  </div>
);