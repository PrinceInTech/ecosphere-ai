import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ScanLine,
  MessageSquare,
  TrendingUp,
  Recycle,
  ArrowRight,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import DemoBadge from "../components/DemoBadge";
import { getAnalytics, getImpact } from "../services/api";
import type { AnalyticsData, ImpactData } from "../types";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [impact, setImpact] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAnalytics(), getImpact()])
      .then(([a, i]) => {
        setAnalytics(a);
        setImpact(i);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Loading dashboard..." />;

  const statCards = [
    {
      label: "Total Analyses",
      value: analytics?.total_analyses ?? 0,
      icon: ScanLine,
      color: "from-emerald-500 to-green-600",
    },
    {
      label: "Recyclable Rate",
      value: `${Math.round(analytics?.recyclable_percentage ?? 0)}%`,
      icon: Recycle,
      color: "from-teal-500 to-cyan-600",
    },
    {
      label: "Items Analyzed",
      value: impact?.total_items_analyzed ?? 0,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "CO₂ Saved (est.)",
      value: `${impact?.estimated_co2_saved_kg ?? 0} kg`,
      icon: MessageSquare,
      color: "from-cyan-500 to-blue-600",
    },
  ];

  return (
    <div className="space-y-8">
      <DemoBadge />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of your waste management activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="card-glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}
              >
                <s.icon size={18} className="text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500">
                {s.label}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          to="/scanner"
          className="card-glass rounded-2xl p-6 group hover:scale-[1.01] transition-all no-underline"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                <ScanLine size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                  Scan Waste
                </h3>
                <p className="text-xs text-gray-500">
                  Upload an image to identify waste
                </p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all"
            />
          </div>
        </Link>

        <Link
          to="/assistant"
          className="card-glass rounded-2xl p-6 group hover:scale-[1.01] transition-all no-underline"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-md">
                <MessageSquare size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                  AI Assistant
                </h3>
                <p className="text-xs text-gray-500">
                  Ask anything about waste management
                </p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all"
            />
          </div>
        </Link>
      </div>

      {analytics?.top_materials && analytics.top_materials.length > 0 && (
        <div className="card-glass rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Top Materials</h3>
          <div className="space-y-3">
            {analytics.top_materials.slice(0, 5).map((m) => (
              <div key={m.material} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700 capitalize">
                      {m.material}
                    </span>
                    <span className="text-gray-500">{m.count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{
                        width: `${
                          (m.count / (analytics.total_analyses || 1)) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
