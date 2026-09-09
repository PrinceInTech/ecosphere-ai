export interface WasteAnalysisResult {
  id: number;
  image_filename: string;
  category: string;
  material: string;
  recyclable: boolean;
  status: string;
  confidence: number;
  disposal_method: string;
  environmental_tip: string;
  safety_warning: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  sources: string[];
  created_at: string;
}

export interface ChatConversation {
  id: number;
  title: string;
  created_at: string;
}

export interface ChatResponse {
  reply: string;
  sources: string[];
  conversation_id: number;
}

export interface KnowledgeDocument {
  id: number;
  title: string;
  source: string;
  category: string;
  content: string;
  created_at: string;
}

export interface AdvisorInput {
  household_size: number;
  weekly_waste: number;
  plastic_usage: string;
  food_waste: string;
  recycling_habits: string;
}

export interface AdvisorResponse {
  suggestions: string[];
  priority_actions: string[];
  estimated_impact: Record<string, string>;
}

export interface AnalyticsData {
  total_analyses: number;
  category_distribution: Record<string, number>;
  recyclable_percentage: number;
  top_materials: { material: string; count: number }[];
}

export interface ImpactData {
  total_items_analyzed: number;
  recyclable_items: number;
  diversion_rate: number;
  estimated_co2_saved_kg: number;
  waste_tips_given: number;
}

export interface DemoStatus {
  demo_mode: boolean;
  ai_service: string;
  ibm_granite_configured: boolean;
}
