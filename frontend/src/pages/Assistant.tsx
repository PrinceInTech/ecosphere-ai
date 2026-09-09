import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import DemoBadge from "../components/DemoBadge";
import { sendMessage, getConversations, getConversationMessages } from "../services/api";
import type { ChatMessage, ChatConversation } from "../types";

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getConversations().then(setConversations).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async (id: number) => {
    setActiveConvId(id);
    try {
      const msgs = await getConversationMessages(id);
      setMessages(msgs);
    } catch {
      toast.error("Failed to load conversation");
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      conversation_id: activeConvId ?? 0,
      role: "user",
      content: text,
      sources: [],
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(text, activeConvId);
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        conversation_id: res.conversation_id,
        role: "assistant",
        content: res.reply,
        sources: res.sources,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setActiveConvId(res.conversation_id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to get response";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <DemoBadge />

      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          AI Assistant
        </h1>
        <p className="text-sm text-gray-500">
          Ask anything about waste management and sustainability
        </p>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {conversations.length > 0 && (
          <div className="hidden md:flex flex-col w-56 shrink-0">
            <div className="card-glass rounded-2xl p-3 flex-1 overflow-y-auto space-y-1">
              <p className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
                History
              </p>
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => loadConversation(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeConvId === c.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {c.title || `Conversation ${c.id}`}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col card-glass rounded-2xl overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 && !loading ? (
              <div className="flex items-center justify-center h-full">
                <EmptyState
                  icon={<MessageSquare size={28} className="text-primary" />}
                  title="Start a Conversation"
                  description="Ask about recycling, waste disposal, composting, or any sustainability topic."
                />
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 mt-1">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200/50">
                        <p className="text-xs opacity-70 font-medium mb-1">
                          Sources:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {m.sources.map((s, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white/20 px-2 py-0.5 rounded-full"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                      <User size={16} className="text-gray-600" />
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <LoadingSpinner size={18} text="" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about waste management..."
                className="input-field flex-1"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="btn-primary p-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
