import { useState, useRef } from "react";
import { Upload, Camera, X } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import ResultCard from "../components/ResultCard";
import EmptyState from "../components/EmptyState";
import DemoBadge from "../components/DemoBadge";
import { analyzeImage } from "../services/api";
import type { WasteAnalysisResult } from "../types";

export default function Scanner() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await analyzeImage(file);
      setResult(res);
      toast.success("Analysis complete!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <DemoBadge />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Waste Scanner
        </h1>
        <p className="text-sm text-gray-500">
          Upload an image of waste to identify its type and disposal method
        </p>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative card-glass rounded-2xl border-2 border-dashed transition-all duration-300 ${
          preview
            ? "border-primary p-4"
            : "border-gray-200 hover:border-primary/50 p-12"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-80 object-contain rounded-xl"
            />
            <button
              onClick={reset}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            className="text-center cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5">
              <Camera size={28} className="text-primary" />
            </div>
            <p className="text-base font-semibold text-gray-900 mb-1">
              Drop an image here or click to upload
            </p>
            <p className="text-xs text-gray-400">
              Supports JPG, PNG, WEBP — Max 10MB
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      {file && !loading && !result && (
        <button onClick={handleAnalyze} className="btn-primary flex items-center gap-2 mx-auto text-sm">
          <Upload size={16} />
          Analyze Image
        </button>
      )}

      {loading && <LoadingSpinner text="Analyzing waste item..." />}

      {result && <ResultCard result={result} />}

      {!preview && !result && !loading && (
        <EmptyState
          icon={<Camera size={28} className="text-primary" />}
          title="No Image Selected"
          description="Upload or drag an image of a waste item to get AI-powered analysis and recycling recommendations."
        />
      )}
    </div>
  );
}
