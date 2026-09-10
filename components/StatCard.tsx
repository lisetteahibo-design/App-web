export default function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "warning" | "danger" | "success";
}) {
  const toneClasses: Record<string, string> = {
    default: "text-navy-900",
    warning: "text-amber-600",
    danger: "text-red-600",
    success: "text-emerald-600",
  };

  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${toneClasses[tone]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}
