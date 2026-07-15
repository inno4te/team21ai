import { useState } from "react";
import { Copy, Plus, Trash2, Check } from "lucide-react";
import { loadPrompts, savePrompts, type Prompt } from "../../services/prompts";

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<Prompt[]>(loadPrompts);
  const [copied, setCopied] = useState("");
  const [draft, setDraft] = useState<{ title: string; body: string } | null>(null);

  const update = (list: Prompt[]) => { setPrompts(list); savePrompts(list); };

  const copy = async (p: Prompt) => {
    await navigator.clipboard.writeText(p.body);
    setCopied(p.id); setTimeout(() => setCopied(""), 1500);
  };

  const add = () => {
    if (!draft?.title.trim() || !draft.body.trim()) return;
    update([{ id: crypto.randomUUID(), title: draft.title.trim(), body: draft.body.trim(), category: "Mine", updatedAt: Date.now() }, ...prompts]);
    setDraft(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-5">
        <p className="text-muted text-sm">Saved locally — works offline.</p>
        <button onClick={() => setDraft({ title: "", body: "" })}
          className="flex items-center gap-1.5 text-xs bg-orange text-ink font-semibold rounded-lg px-3 py-2">
          <Plus size={14} /> New prompt
        </button>
      </div>

      {draft && (
        <div className="border border-orange/50 bg-surface rounded-xl p-4 mb-4 space-y-2">
          <input autoFocus value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}
            placeholder="Prompt title" className="w-full bg-transparent outline-none text-sm font-medium" />
          <textarea value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })}
            placeholder="Prompt text — use [brackets] for the parts you'll fill in" rows={3}
            className="w-full bg-transparent outline-none text-sm text-muted resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setDraft(null)} className="text-xs text-muted px-3 py-1.5">Cancel</button>
            <button onClick={add} className="text-xs bg-orange text-ink font-semibold rounded-lg px-3 py-1.5">Save prompt</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {prompts.map(p => (
          <div key={p.id} className="group border border-edge bg-surface rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="font-mono text-[10px] text-orange mt-0.5">{p.category}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => copy(p)} title="Copy"
                  className="p-1.5 text-muted hover:text-orange">{copied === p.id ? <Check size={14} /> : <Copy size={14} />}</button>
                <button onClick={() => update(prompts.filter(x => x.id !== p.id))} title="Delete"
                  className="p-1.5 text-muted hover:text-orange-soft"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-muted text-xs mt-2 whitespace-pre-wrap leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
