import { useState } from "react";
import {
  Leaf,
  Users,
  Trash2,
  Utensils,
  ShoppingBag,
  Recycle,
  CheckCircle2,
  Zap,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import DemoBadge from "../components/DemoBadge";
import { getAdvisorRecommendations } from "../services/api";
import type { AdvisorInput, AdvisorResponse } from "../types";

const recyclingOptions = ["Excellent", "Good", "Average", "Poor", "None"];
const levelOptions = ["Low", "Moderate", "High"];

export default function Advisor() {
  const [form, setForm] = useState<AdvisorInput>({
    household_size: 2,
    weekly_waste: 10,
    plastic_usage: "moderate",
    food_waste: "low",
    recycling_habits: "average",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResponse | null>(null);

  const handleChange = (field: keyof AdvisorInput, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getAdvisorRecommendations(form);
      setResult(res);
      toast.success("Recommendations ready!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to get recommendations";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "household_size" as const,
      label: "Household Size",
      icon: Users,
      type: "number",
      min: 1,
      max: 20,
    },
    {
      key: "weekly_waste" as const,
      label: "Weekly Waste (kg)",
      icon: Trash2,
      type: "number",
      min: 1,
      max: 100,
    },
  ];

  const levelFields = [
    {
      key: "plastic_usage" as const,
      label: "Plastic Usage",
      icon: ShoppingBag,
    },
    {
      key: "food_waste" as const,
      label: "Food Waste",
      icon: Utensils,
    },
  ];

  const handleLevel = (key: "plastic_usage" | "food_waste", val: string) => {
    const mapped = val.toLowerCase();
    setForm((prev) => ({ ...prev, [key]: mapped }));
  };

  return (
    <div className="space-y-8">
      <DemoBadge />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Sustainability Advisor
        </h1>
        <p className="text-sm text-gray-500">
          Get personalized recommendations to reduce your environmental footprint
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card-glass rounded-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <f.icon size={15} className="text-primary" />
                {f.label}
              </label>
              <input
                type={f.type}
                min={f.min}
                max={f.max}
                value={form[f.key]}
                onChange={(e) => handleChange(f.key, Number(e.target.value))}
                className="input-field"
              />
            </div>
          ))}
          {levelFields.map((f) => (
            <div key={f.key}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <f.icon size={15} className="text-primary" />
                {f.label}
              </label>
              <div className="flex flex-wrap gap-2">
                {levelOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleLevel(f.key, opt)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      form[f.key] === opt.toLowerCase()
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-white border-gray-200 text-gray-600 hover:border-primary/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Recycle size={15} className="text-primary" />
            Recycling Habits
          </label>
          <div className="flex flex-wrap gap-2">
            {recyclingOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() =>
                  handleChange("recycling_habits", opt.toLowerCase())
                }
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  form.recycling_habits === opt.toLowerCase()
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white border-gray-200 text-gray-600 hover:border-primary/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Leaf size={16} />
          Get Recommendations
        </button>
      </form>

      {loading && <LoadingSpinner text="Generating recommendations..." />}

      {result && !loading && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="card-glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <Zap size={18} className="text-amber-500" />
              Priority Actions
            </h3>
            <div className="space-y-3">
              {result.priority_actions.map((action, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-gray-700">{action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <Leaf size={18} className="text-primary" />
              Suggestions
            </h3>
            <div className="space-y-3">
              {result.suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <Target size={18} className="text-secondary" />
              Estimated Impact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-primary">
                  {result.estimated_impact.waste_reduction_percent}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Waste Reduction (est.)</p>
              </div>
              <div className="bg-surface-alt rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-secondary">
                  {result.estimated_impact.co2_savings_kg_per_year} kg
                </p>
                <p className="text-xs text-gray-500 mt-1">CO₂ Savings/Year (est.)</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-emerald-600">
                  {result.estimated_impact.energy_savings_percent}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Energy Savings (est.)</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Illustrative estimates only — actual impact varies by material, location and
              disposal method.
            </p>
          </div>
        </div>
      )}

      {!result && !loading && (
        <EmptyState
          icon={<Leaf size={28} className="text-primary" />}
          title="No Recommendations Yet"
          description="Fill in your household details above and click 'Get Recommendations' to receive personalized sustainability advice."
        />
      )}
    </div>
  );
}
