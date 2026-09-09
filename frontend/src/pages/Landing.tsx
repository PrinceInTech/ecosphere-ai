import { Link } from "react-router-dom";
import {
  ScanLine,
  MessageSquare,
  Leaf,
  BarChart3,
  Calculator,
  BookOpen,
  ArrowRight,
  Globe,
  Sparkles,
} from "lucide-react";

const features = [
  {
    to: "/scanner",
    icon: ScanLine,
    title: "Waste Scanner",
    desc: "AI-powered image recognition to identify waste types and recyclability.",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    to: "/assistant",
    icon: MessageSquare,
    title: "AI Assistant",
    desc: "Chat with an AI trained on sustainable waste management practices.",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    to: "/advisor",
    icon: Leaf,
    title: "Sustainability Advisor",
    desc: "Get personalized recommendations to reduce your environmental footprint.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    to: "/analytics",
    icon: BarChart3,
    title: "Analytics",
    desc: "Track waste trends, recycling rates, and environmental metrics.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    to: "/impact",
    icon: Calculator,
    title: "Impact Calculator",
    desc: "Measure your environmental impact and CO2 reduction efforts.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    to: "/knowledge",
    icon: BookOpen,
    title: "Knowledge Base",
    desc: "Access a comprehensive library of sustainability resources.",
    gradient: "from-green-500 to-lime-600",
  },
];

export default function Landing() {
  return (
    <div className="space-y-16 sm:space-y-24">
      <section className="text-center pt-8 sm:pt-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-6">
          <Sparkles size={14} />
          AI-Powered Sustainable Waste Management
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Manage Waste
          <br />
          <span className="gradient-text">Sustainably</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          EcoSphere AI helps you identify, sort, and manage waste responsibly.
          Uses a pluggable AI service (IBM Granite when configured, or local
          demo mode) to support <span className="font-semibold text-primary">SDG 12</span> —
          Responsible Consumption & Production.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/scanner"
            className="btn-primary flex items-center gap-2 text-sm no-underline"
          >
            <ScanLine size={16} />
            Start Scanning
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/assistant"
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all no-underline"
          >
            <MessageSquare size={16} />
            Chat with AI
          </Link>
        </div>
      </section>

      <section>
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Everything You Need
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            A complete toolkit for sustainable waste management
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="card-glass rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-300 no-underline"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow`}
              >
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card-glass rounded-3xl p-8 sm:p-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Globe size={28} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
          We leverage artificial intelligence to make waste management accessible,
          educational, and impactful. Every item you scan contributes to a global
          effort toward zero waste.
        </p>
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold gradient-text">
              SDG 12
            </p>
            <p className="text-xs text-gray-500 mt-1">Our Goal</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold gradient-text">
              AI
            </p>
            <p className="text-xs text-gray-500 mt-1">Our Engine</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold gradient-text">
              0
            </p>
            <p className="text-xs text-gray-500 mt-1">Waste Target</p>
          </div>
        </div>
      </section>
    </div>
  );
}
