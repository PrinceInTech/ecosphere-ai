import type {
  WasteAnalysisResult,
  ChatResponse,
  ChatConversation,
  ChatMessage,
  KnowledgeDocument,
  AdvisorInput,
  AdvisorResponse,
  AnalyticsData,
  ImpactData,
  DemoStatus,
} from "../types";

const DEV_API_BASE = "http://localhost:8000";
const PROD_API_BASE = "https://ecosphere-ai-backend.onrender.com";

/**
 * Resolve the Vite-provided API base to a canonical value that always ends
 * with the `/api` path prefix used by every backend route.
 *
 * - Honors `VITE_API_BASE_URL` when set (with or without a trailing `/api`).
 * - Falls back to the production backend when built for production so a
 *   localhost URL can never be baked into the deployed bundle.
 * - Falls back to the local dev backend when running in development.
 */
function normalizeApiBase(raw: string | undefined): string {
  let base = (raw || "").trim().replace(/\/+$/, "");
  if (!base) {
    base = import.meta.env.PROD ? PROD_API_BASE : DEV_API_BASE;
  }
  try {
    const pathname = new URL(base).pathname.replace(/\/+$/, "");
    if (pathname !== "/api") {
      base = `${base}/api`;
    }
  } catch {
    if (!base.endsWith("/api")) {
      base = `${base}/api`;
    }
  }
  return base;
}

const API_BASE = normalizeApiBase(
  import.meta.env.VITE_API_BASE_URL as string | undefined
);

async function extractErrorMessage(
  res: Response,
  fallback: string
): Promise<string> {
  try {
    const text = await res.text();
    const parsed = JSON.parse(text);
    const detail = parsed.detail ?? parsed.message ?? parsed.error;
    if (typeof detail === "string" && detail) {
      return detail;
    }
    if (Array.isArray(detail) && detail.length && typeof detail[0]?.msg === "string") {
      return detail[0].msg;
    }
    return text || fallback;
  } catch {
    return fallback;
  }
}

function networkErrorMessage(url: string, err: unknown): string {
  const reason =
    err instanceof Error && err.message
      ? ` (${err.message})`
      : "";
  return `Network error reaching ${url}${reason}. Check that the API server is online and the request is allowed (CORS).`;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });
  } catch (err) {
    throw new Error(networkErrorMessage(`${API_BASE}${url}`, err));
  }

  if (!res.ok) {
    const message = await extractErrorMessage(
      res,
      `API error: ${res.status} ${res.statusText}`
    );
    throw new Error(message);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return res.text() as unknown as Promise<T>;
}

export async function analyzeImage(file: File): Promise<WasteAnalysisResult> {
  const form = new FormData();
  form.append("file", file);
  const url = `${API_BASE}/analyze-image`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      body: form,
    });
  } catch (err) {
    throw new Error(networkErrorMessage(url, err));
  }
  if (!res.ok) {
    const message = await extractErrorMessage(
      res,
      `Analysis failed: ${res.status} ${res.statusText}`
    );
    throw new Error(message);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json() as Promise<WasteAnalysisResult>;
  }
  return (await res.text()) as unknown as Promise<WasteAnalysisResult>;
}

export async function sendMessage(
  message: string,
  conversationId?: number
): Promise<ChatResponse> {
  return request<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      conversation_id: conversationId ?? null,
    }),
  });
}

export async function getConversations(): Promise<ChatConversation[]> {
  const data = await request<{ conversations: ChatConversation[] }>(
    "/conversations"
  );
  return data.conversations;
}

export async function getConversationMessages(
  id: number
): Promise<ChatMessage[]> {
  return request<ChatMessage[]>(`/conversations/${id}/messages`);
}

export async function getDocuments(
  category?: string
): Promise<KnowledgeDocument[]> {
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  return request<KnowledgeDocument[]>(`/knowledge${params}`);
}

export async function searchDocuments(
  query: string
): Promise<KnowledgeDocument[]> {
  const data = await request<{ results: KnowledgeDocument[] }>(
    "/knowledge/search",
    {
      method: "POST",
      body: JSON.stringify({ query }),
    }
  );
  return data.results;
}

export async function addDocument(
  doc: Partial<KnowledgeDocument>
): Promise<KnowledgeDocument> {
  return request<KnowledgeDocument>("/knowledge", {
    method: "POST",
    body: JSON.stringify(doc),
  });
}

export async function getAdvisorRecommendations(
  data: AdvisorInput
): Promise<AdvisorResponse> {
  return request<AdvisorResponse>("/advisor", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAnalytics(): Promise<AnalyticsData> {
  return request<AnalyticsData>("/analytics");
}

export async function getImpact(): Promise<ImpactData> {
  return request<ImpactData>("/impact");
}

export async function getHistory(): Promise<WasteAnalysisResult[]> {
  return request<WasteAnalysisResult[]>("/history");
}

export async function getDemoStatus(): Promise<DemoStatus> {
  return request<DemoStatus>("/demo-status");
}

export async function checkHealth(): Promise<{ status: string }> {
  return request<{ status: string }>("/health");
}
