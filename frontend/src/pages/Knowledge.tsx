import { useEffect, useState } from "react";
import { BookOpen, Search, Plus, Tag, X } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import DemoBadge from "../components/DemoBadge";
import EmptyState from "../components/EmptyState";
import {
  getDocuments,
  searchDocuments,
  addDocument,
} from "../services/api";
import type { KnowledgeDocument } from "../types";

const categories = [
  "All",
  "Recycling",
  "Composting",
  "Hazardous Waste",
  "Plastic",
  "E-Waste",
  "General",
];

export default function Knowledge() {
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newDoc, setNewDoc] = useState({
    title: "",
    category: "General",
    content: "",
    source: "",
  });

  const loadDocs = (category?: string) => {
    setLoading(true);
    const cat = category === "All" ? undefined : category;
    getDocuments(cat)
      .then(setDocs)
      .catch(() => toast.error("Failed to load documents"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDocs(activeCategory);
  }, [activeCategory]);

  const handleSearch = async () => {
    if (!query.trim()) {
      loadDocs(activeCategory);
      return;
    }
    setLoading(true);
    try {
      const results = await searchDocuments(query);
      setDocs(results);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDocument(newDoc);
      toast.success("Document added!");
      setShowAdd(false);
      setNewDoc({ title: "", category: "General", content: "", source: "" });
      loadDocs(activeCategory);
    } catch {
      toast.error("Failed to add document");
    }
  };

  return (
    <div className="space-y-6">
      <DemoBadge />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Knowledge Base
          </h1>
          <p className="text-sm text-gray-500">
            Explore sustainability and waste management resources
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-primary flex items-center gap-2 text-sm shrink-0"
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />}
          {showAdd ? "Cancel" : "Add Document"}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="card-glass rounded-2xl p-6 space-y-4 animate-fade-in-up"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                Title
              </label>
              <input
                type="text"
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc((p) => ({ ...p, title: e.target.value }))
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                Category
              </label>
              <select
                value={newDoc.category}
                onChange={(e) =>
                  setNewDoc((p) => ({ ...p, category: e.target.value }))
                }
                className="input-field"
              >
                {categories.slice(1).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              Source
            </label>
            <input
              type="text"
              value={newDoc.source}
              onChange={(e) =>
                setNewDoc((p) => ({ ...p, source: e.target.value }))
              }
              className="input-field"
              placeholder="e.g., EPA, WHO"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              Content
            </label>
            <textarea
              value={newDoc.content}
              onChange={(e) =>
                setNewDoc((p) => ({ ...p, content: e.target.value }))
              }
              className="input-field min-h-[100px] resize-y"
              required
            />
          </div>
          <button type="submit" className="btn-primary text-sm">
            Add Document
          </button>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search documents..."
            className="input-field pl-9"
          />
        </div>
        <button onClick={handleSearch} className="btn-primary text-sm shrink-0">
          Search
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === c
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-primary/50"
            }`}
          >
            <Tag size={12} />
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading documents..." />
      ) : docs.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={28} className="text-primary" />}
          title="No Documents Found"
          description="Try a different search query or category, or add a new document."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="card-glass rounded-2xl p-5 cursor-pointer hover:scale-[1.01] transition-all"
              onClick={() =>
                setExpandedId(expandedId === doc.id ? null : doc.id)
              }
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-gray-900 text-sm">{doc.title}</h4>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0 ml-2">
                  {doc.category}
                </span>
              </div>
              {doc.source && (
                <p className="text-xs text-gray-400 mb-2">Source: {doc.source}</p>
              )}
              <p
                className={`text-sm text-gray-600 leading-relaxed ${
                  expandedId === doc.id ? "" : "line-clamp-3"
                }`}
              >
                {doc.content}
              </p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
