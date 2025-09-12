"use client";

type Props = {
  title: string;
  value: string;
  sub?: string;
  className?: string;
};

export default function StatCard({ title, value, sub, className }: Props) {
  return (
    <div className={`p-4 rounded-xl bg-white/5 border border-white/10 ${className ?? ""}`}>
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  );
}
