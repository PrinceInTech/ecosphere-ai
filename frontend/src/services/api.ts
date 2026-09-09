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

const DEFAULT_API_BASE = "http://localhost:8000/api";
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/+$/,
    ""
  ) || DEFAULT_API_BASE;

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `API error: ${res.status}`;
    try {
      const text = await res.text();
      const parsed = JSON.parse(text);
      message = parsed.detail || parsed.message || message;
    } catch {
      // non-json error body
    }
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
  const res = await fetch(`${API_BASE}/analyze-image`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    let message = `Analysis failed: ${res.status}`;
    try {
      const parsed = JSON.parse(text);
      message = parsed.detail || parsed.message || message;
    } catch {
      // non-json
    }
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
