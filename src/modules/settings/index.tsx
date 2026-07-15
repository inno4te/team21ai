import { useState } from "react";
import { getBackendUrl, setBackendUrl, hasBackend } from "../../services/backend";
import { useAuth } from "../../core/auth/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const [url, setUrl] = useState(getBackendUrl());
  const [saved, setSaved] = useState(false);

  const save = () => {
    setBackendUrl(url);
    setSaved(true); setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 space-y-8">
      <section>
        <h2 className="font-display font-bold">Backend</h2>
        <p className="text-muted text-xs mt-1 mb-3">
          Paste your Google Apps Script Web App URL (ends in <span className="font-mono">/exec</span>).
          It routes chat through free LLM tiers and holds all API keys server-side.
        </p>
        <div className="flex gap-2">
          <input value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/…/exec"
            className="flex-1 bg-surface border border-edge rounded-lg px-3.5 py-2.5 text-sm font-mono outline-none focus:border-orange" />
          <button onClick={save} className="bg-orange text-ink font-semibold rounded-lg px-4 text-sm">
            {saved ? "Saved" : "Save"}
          </button>
        </div>
        <p className="text-xs mt-2 text-muted">
          Status: {hasBackend() ? <span className="text-emerald-400">connected URL set</span> : <span className="text-orange-soft">not configured — demo mode</span>}
        </p>
      </section>

      <section>
        <h2 className="font-display font-bold">Account</h2>
        <p className="text-muted text-xs mt-1">{user?.demo ? "Demo mode — create a real account once your backend is connected." : `${user?.name} · ${user?.email} · ${user?.role}`}</p>
        <button onClick={logout} className="mt-3 text-xs border border-edge hover:border-orange rounded-lg px-3.5 py-2 text-muted hover:text-text transition-colors">
          Sign out
        </button>
      </section>

      <section>
        <h2 className="font-display font-bold">Coming next</h2>
        <p className="text-muted text-xs mt-1">Language (EN/FR) · model cache manager · bring-your-own-key slot · KB sync.</p>
      </section>
    </div>
  );
}
