export default function StatCard({ title, value, color }: any) {
  return (
    <div
      className="bg-white p-5 rounded-xl shadow-sm border-l-4 hover:shadow-md transition"
      style={{ borderColor: color }}
    >
      <h4 className="text-gray-500 text-sm">{title}</h4>
      <h2 className="text-2xl font-bold mt-2 text-gray-800">
        {value}
      </h2>
    </div>
  );
}