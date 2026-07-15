import { api } from "./backend";

export interface ChatMessage { role: "user" | "assistant"; content: string; }
export interface LlmReply { text: string; provider: string; tokensUsed?: number; }

/** Sends chat history (plus optional RAG context) through the free-tier LLM router. */
export function chat(messages: ChatMessage[], context?: string): Promise<LlmReply> {
  // Keep payloads lean: last 12 turns is plenty for a coaching conversation.
  return api<LlmReply>("llm.chat", { messages: messages.slice(-12), context });
}
