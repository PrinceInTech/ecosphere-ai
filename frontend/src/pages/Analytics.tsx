import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, Recycle, Layers } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import DemoBadge from "../components/DemoBadge";
import EmptyState from "../components/EmptyState";
import { getAnalytics } from "../services/api";
import type { AnalyticsData } from "../types";

const COLORS = [
  "#059669",
  "#0891b2",
  "#10b981",
  "#22d3ee",
  "#047857",
  "#0e7490",
  "#34d399",
  "#67e8f9",
  "#065f46",
  "#155e75",
];

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Loading analytics..." />;

  if (!data || data.total_analyses === 0) {
    return (
      <div className="space-y-8">
        <DemoBadge />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
        <EmptyState
          icon={<BarChart3 size={28} className="text-primary" />}
          title="No Data Yet"
          description="Start scanning waste items to see analytics and visualizations of your recycling patterns."
        />
      </div>
    );
  }

  const pieData = Object.entries(data.category_distribution).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="space-y-8">
      <DemoBadge />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Insights from your waste analysis history
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-glass rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Layers size={18} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-500">
              Total Analyses
            </span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {data.total_analyses}
          </p>
        </div>

        <div className="card-glass rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <Recycle size={18} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-500">
              Recyclable Rate
            </span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {Math.round(data.recyclable_percentage)}%
          </p>
        </div>

        <div className="card-glass rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-500">
              Top Material
            </span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 capitalize">
            {data.top_materials[0]?.material || "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glass rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">
            Category Distribution
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-12">
              No data
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {pieData.map((d, i) => (
              <span
                key={d.name}
                className="flex items-center gap-1.5 text-xs text-gray-600"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                {d.name}
              </span>
            ))}
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Top Materials</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.top_materials}>
              <XAxis
                dataKey="material"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                }}
              />
              <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
