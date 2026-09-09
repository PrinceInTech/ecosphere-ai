import { useEffect, useState } from "react";
import { Calculator, Recycle, TreePine, DollarSign, TrendingUp } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import DemoBadge from "../components/DemoBadge";
import EmptyState from "../components/EmptyState";
import { getImpact } from "../services/api";
import type { ImpactData } from "../types";

export default function Impact() {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImpact()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Calculating impact..." />;

  if (!data || data.total_items_analyzed === 0) {
    return (
      <div className="space-y-8">
        <DemoBadge />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Impact Calculator</h1>
        <EmptyState
          icon={<Calculator size={28} className="text-primary" />}
          title="No Impact Data"
          description="Scan waste items to see your environmental impact and contribution to waste diversion."
        />
      </div>
    );
  }

  const diversionPct = Math.round(data.diversion_rate ?? 0);

  const stats = [
    {
      label: "Total Items Analyzed",
      value: data.total_items_analyzed,
      icon: Calculator,
      gradient: "from-emerald-500 to-green-600",
      bg: "bg-surface",
    },
    {
      label: "Recyclable Identified",
      value: data.recyclable_items,
      icon: Recycle,
      gradient: "from-teal-500 to-cyan-600",
      bg: "bg-surface-alt",
    },
    {
      label: "CO₂ Saved (est.)",
      value: `${data.estimated_co2_saved_kg} kg`,
      icon: TreePine,
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Waste Tips Given",
      value: data.waste_tips_given,
      icon: TrendingUp,
      gradient: "from-cyan-500 to-blue-600",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <div className="space-y-8">
      <DemoBadge />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Impact Calculator
        </h1>
        <p className="text-sm text-gray-500">
          Your contribution to sustainable waste management
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map((s) => (
          <div key={s.label} className={`card-glass rounded-2xl p-6 ${s.bg}`}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}
              >
                <s.icon size={22} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                {s.label}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card-glass rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-6">Diversion Rate</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${diversionPct * 2.64} ${
                  264 - diversionPct * 2.64
                }`}
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-gray-900">
                {diversionPct}%
              </span>
              <span className="text-xs text-gray-500">diverted</span>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Items analyzed</span>
              <span className="font-semibold text-gray-900">
                {data.total_items_analyzed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Recyclable found</span>
              <span className="font-semibold text-primary">
                {data.recyclable_items}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Diversion rate</span>
              <span className="font-semibold text-secondary">
                {data.diversion_rate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">CO₂ saved (est.)</span>
              <span className="font-semibold text-emerald-600">
                {data.estimated_co2_saved_kg} kg
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-glass rounded-2xl p-6">
        <p className="text-xs text-gray-400">
          Illustrative estimate — actual environmental impact varies by material,
          location and disposal method. These figures are based on simplified
          assumptions and are not scientifically validated measurements.
        </p>
      </div>

      <div className="card-glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign size={18} className="text-emerald-600" />
          <h3 className="font-bold text-gray-900">SDG 12 Contribution</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          By analyzing and correctly disposing of{" "}
          <span className="font-semibold text-primary">
            {data.total_items_analyzed}
          </span>{" "}
          items, you have contributed to{" "}
          <span className="font-semibold">UN Sustainable Development Goal 12</span>{" "}
          — Responsible Consumption and Production. Your efforts help reduce
          landfill waste and promote circular economy principles.
        </p>
      </div>
    </div>
  );
}
