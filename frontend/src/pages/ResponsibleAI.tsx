import {
  ShieldCheck,
  Eye,
  Lock,
  Scale,
  Heart,
  Brain,
  Leaf,
  Users,
  NotebookPen,
} from "lucide-react";
import DemoBadge from "../components/DemoBadge";

const principles = [
  {
    icon: Eye,
    title: "Transparency",
    desc: "Every AI recommendation shows its confidence level and whether it was generated in demo mode or by a real model. Image classification is clearly labeled as an assistive recommendation, not a definitive judgment.",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: Lock,
    title: "Data Privacy",
    desc: "Uploaded images are validated for type and size, stored temporarily for analysis, and never exposed publicly. Personal information is not collected unless required, and all secrets stay in server-side environment variables.",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    icon: Scale,
    title: "Fairness",
    desc: "Recommendations avoid biased assumptions about users or communities. The knowledge base provides general guidance equally applicable to all users, and we do not make demographic or socioeconomic assumptions.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Heart,
    title: "Ethics & Safety",
    desc: "Hazardous waste guidance is safety-first. We never generate harmful, discriminatory, or misleading disposal instructions, and we always direct users to verify with local official regulations.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Brain,
    title: "Honesty About AI",
    desc: "We do not claim an external AI model is used when it is not. Demo mode is clearly labeled. When IBM Granite or another provider is configured, it is used; otherwise deterministic local responses power the demo.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: NotebookPen,
    title: "No Fabricated Facts",
    desc: "The knowledge base contains general sustainability guidance, not fabricated official policies. Content that depends on local rules is explicitly labeled as general guidance pending verification.",
    gradient: "from-green-500 to-lime-600",
  },
];

const commitments = [
  {
    icon: Leaf,
    title: "Input Validation",
    desc: "Uploads are restricted by file type and size (max 10MB, image formats only). Invalid and oversized files are rejected with clear error messages, protecting both users and the system.",
  },
  {
    icon: Users,
    title: "Accessible & Inclusive",
    desc: "The interface is responsive, mobile-friendly, and built with accessibility in mind, so sustainability tools are usable by diverse communities regardless of device.",
  },
  {
    icon: ShieldCheck,
    title: "Uncertainty Disclosure",
    desc: "When AI confidence is low, results explicitly advise the user to verify. RAG responses show their sources, and estimates are always labeled as illustrative rather than exact measurements.",
  },
];

export default function ResponsibleAI() {
  return (
    <div className="space-y-10">
      <DemoBadge />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Responsible AI
        </h1>
        <p className="text-sm text-gray-500">
          Our commitment to ethical, transparent, and fair AI
        </p>
      </div>

      <div className="card-glass rounded-3xl p-8 sm:p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg mb-6">
          <ShieldCheck size={32} className="text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          Our AI Principles
        </h2>
        <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          EcoSphere AI is built on foundational principles that ensure our
          AI-powered recommendations are fair, transparent, ethical, and
          privacy-respecting.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {principles.map((p) => (
          <div key={p.title} className="card-glass rounded-2xl p-6">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4 shadow-md`}
            >
              <p.icon size={22} className="text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="card-glass rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Practical Privacy & Safety Measures
        </h3>
        <div className="space-y-5">
          {commitments.map((c) => (
            <div key={c.title} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <c.icon size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {c.title}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-glass rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          About the AI Architecture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface rounded-xl p-4">
            <p className="text-xs font-semibold text-primary mb-1">
              AI Service Layer
            </p>
            <p className="text-sm text-gray-700">
              A pluggable AIService abstraction supports IBM Granite when
              credentials are configured, and falls back to an honest local demo
              mode otherwise.
            </p>
          </div>
          <div className="bg-surface-alt rounded-xl p-4">
            <p className="text-xs font-semibold text-secondary mb-1">
              Retrieval-Augmented Generation
            </p>
            <p className="text-sm text-gray-700">
              RAG retrieves relevant documents from the local knowledge base and
              uses them as context, with sources surfaced to the user rather than
              fabricating citations.
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-600 mb-1">
              Knowledge Base
            </p>
            <p className="text-sm text-gray-700">
              Contains general sustainability guidance with category, source, and
              content metadata. Content is labeled as general guidance when local
              rules may differ.
            </p>
          </div>
          <div className="bg-cyan-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-cyan-600 mb-1">
              Impact Estimates
            </p>
            <p className="text-sm text-gray-700">
              Environmental metrics are clearly labeled as illustrative estimates
              with stated assumptions — never presented as scientifically exact
              measurements.
            </p>
          </div>
        </div>
      </div>

      <div className="card-glass rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          SDG 12 — Responsible Consumption & Production
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          EcoSphere AI directly supports UN Sustainable Development Goal 12 by
          empowering individuals and communities to make informed decisions about
          waste management, promoting recycling and responsible consumption, and
          helping reduce the environmental impact of everyday waste.
        </p>
      </div>
    </div>
  );
}
