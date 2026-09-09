import { Beaker, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { getDemoStatus } from "../services/api";
import type { DemoStatus } from "../types";

export default function DemoBadge() {
  const [status, setStatus] = useState<DemoStatus | null>(null);

  useEffect(() => {
    getDemoStatus()
      .then(setStatus)
      .catch(() => {});
  }, []);

  if (!status?.demo_mode) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs font-medium text-amber-800">
        <Beaker size={14} className="text-amber-600" />
        <span>
          <span className="font-bold">Demo AI Mode</span> — Running with simulated responses
        </span>
        <Info size={12} className="text-amber-500" />
      </div>
    </div>
  );
}
