export default function StatCard({ title, value, color }: any) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        borderLeft: `5px solid ${color}`,
      }}
    >
      <h4 style={{ color: "#666" }}>{title}</h4>
      <h2 style={{ fontSize: "28px", marginTop: "10px" }}>{value}</h2>
    </div>
  );
}
