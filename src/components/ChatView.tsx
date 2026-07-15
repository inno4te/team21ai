import { useEffect, useRef, useState, type FormEvent } from "react";
import { SendHorizonal, Sparkles } from "lucide-react";
import { chat, type ChatMessage } from "../services/llm";
import { hasBackend } from "../services/backend";
import { Link } from "react-router-dom";

interface Props {
  systemHint: string;          // rendered as the empty-state headline
  placeholder: string;
  quickChips?: string[];       // one-tap starter questions
  context?: string;            // RAG context (AI Coach injects retrieved chunks here, week 3–4)
  storageKey: string;          // per-module chat history
}

export default function ChatView({ systemHint, placeholder, quickChips = [], context, storageKey }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) ?? "[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState("");
  const [error, setError] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(messages.slice(-40))); }, [messages, storageKey]);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    setError("");
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next); setInput(""); setBusy(true);
    try {
      const reply = await chat(next, context);
      setProvider(reply.provider);
      setMessages([...next, { role: "assistant", content: reply.text }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally { setBusy(false); }
  };

  const submit = (e: FormEvent) => { e.preventDefault(); send(input); };

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="pt-14 text-center">
            <Sparkles className="mx-auto text-orange" size={28} />
            <p className="font-display font-bold text-xl mt-4">{systemHint}</p>
            {!hasBackend() && (
              <p className="text-muted text-sm mt-3">
                Chat needs a backend. Add your Apps Script URL in{" "}
                <Link to="/settings" className="text-orange underline underline-offset-2">Settings</Link> — it takes two minutes.
              </p>
            )}
            {quickChips.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {quickChips.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="text-xs border border-edge bg-surface hover:border-orange rounded-full px-3.5 py-1.5 text-muted hover:text-text transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={
              "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed " +
              (m.role === "user" ? "bg-orange text-ink rounded-br-sm" : "bg-surface border border-edge rounded-bl-sm")
            }>
              {m.content}
            </div>
          </div>
        ))}

        {busy && <div className="text-muted text-xs animate-pulse pl-1">Thinking…</div>}
        {error && <div className="text-orange-soft text-xs bg-surface border border-edge rounded-lg p-3">{error}</div>}
        <div ref={bottom} />
      </div>

      <form onSubmit={submit} className="shrink-0 px-4 md:px-6 pb-5 pt-2">
        <div className="flex items-end gap-2 bg-surface border border-edge rounded-xl px-3 py-2 focus-within:border-orange transition-colors">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm max-h-32 py-1.5"
          />
          <button disabled={busy || !input.trim()}
            className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-orange text-ink disabled:opacity-40 transition-opacity">
            <SendHorizonal size={16} />
          </button>
        </div>
        {provider && <p className="font-mono text-[10px] text-muted/60 mt-1.5 pl-1">answered by {provider} · free tier</p>}
      </form>
    </div>
  );
}
