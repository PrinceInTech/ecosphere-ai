import type { ReactElement } from "react";
import { Recycle, AlertTriangle, Trash2 } from "lucide-react";
import type { WasteAnalysisResult } from "../types";

interface ResultCardProps {
  result: WasteAnalysisResult;
}

const categoryColors: Record<string, string> = {
  plastic: "bg-blue-100 text-blue-700",
  glass: "bg-purple-100 text-purple-700",
  paper: "bg-amber-100 text-amber-700",
  metal: "bg-gray-100 text-gray-700",
  organic: "bg-green-100 text-green-700",
  electronic: "bg-red-100 text-red-700",
  textile: "bg-pink-100 text-pink-700",
  hazardous: "bg-orange-100 text-orange-700",
};

const categoryIcons: Record<string, ReactElement> = {
  plastic: <Recycle size={16} />,
  glass: <Recycle size={16} />,
  paper: <Recycle size={16} />,
  metal: <Recycle size={16} />,
  organic: <Trash2 size={16} />,
  hazardous: <AlertTriangle size={16} />,
};

const statusColors: Record<string, string> = {
  Recyclable: "bg-emerald-100 text-emerald-700",
  Compostable: "bg-green-100 text-green-700",
  "Not Recyclable": "bg-red-100 text-red-700",
  "Hazardous Waste": "bg-orange-100 text-orange-700",
  "Recyclable (E-Waste)": "bg-red-100 text-red-700",
  "Recyclable (Textile)": "bg-pink-100 text-pink-700",
};

export default function ResultCard({ result }: ResultCardProps) {
  const colorClass =
    categoryColors[result.category.toLowerCase()] ||
    "bg-gray-100 text-gray-700";
  const icon = categoryIcons[result.category.toLowerCase()] || (
    <Recycle size={16} />
  );
  const confidencePct = Math.round(result.confidence * 100);
  const statusClass =
    statusColors[result.status] || "bg-gray-100 text-gray-700";

  return (
    <div className="card-glass rounded-2xl p-6 transition-all duration-200 animate-fade-in-up">
      <div className="flex items-start justify-between mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
        >
          {icon}
          {result.category}
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass}`}
        >
          {result.status}
        </span>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mb-1 capitalize">
        {result.material}
      </h4>
      <p className="text-xs text-gray-500 mb-4">
        {result.image_filename}
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Confidence</span>
          <span className="font-semibold text-gray-700">{confidencePct}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs font-semibold text-primary mb-1">
            Disposal Method
          </p>
          <p className="text-sm text-gray-700">{result.disposal_method}</p>
        </div>

        {result.environmental_tip && (
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-xs font-semibold text-secondary mb-1">
              Environmental Tip
            </p>
            <p className="text-sm text-gray-700">{result.environmental_tip}</p>
          </div>
        )}

        {result.safety_warning && (
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
            <p className="text-xs font-semibold text-orange-600 mb-1">
              Safety Warning
            </p>
            <p className="text-sm text-gray-700">{result.safety_warning}</p>
          </div>
        )}
      </div>
    </div>
  );
}
