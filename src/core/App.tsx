import { Suspense, useState, type FormEvent } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { registry } from "./moduleRegistry";
import Layout from "./layout/Layout";
import { useAuth } from "./auth/AuthContext";
import { hasBackend } from "../services/backend";

function Login() {
  const { login, register, enterDemo } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const backend = hasBackend();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <p className="font-display font-extrabold text-4xl tracking-tight">
          T21 <span className="text-orange">AI</span> Workspace
        </p>
        <p className="text-muted mt-2 mb-8 text-sm">Learn, build and get things done — your files stay on your device.</p>

        {backend ? (
          <form onSubmit={submit} className="space-y-3">
            {mode === "register" && (
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required
                className="w-full bg-surface border border-edge rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-orange" />
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required
              className="w-full bg-surface border border-edge rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-orange" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6}
              className="w-full bg-surface border border-edge rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-orange" />
            {error && <p className="text-orange-soft text-xs">{error}</p>}
            <button disabled={busy}
              className="w-full bg-orange hover:bg-orange-soft disabled:opacity-50 text-ink font-semibold rounded-lg py-2.5 text-sm transition-colors">
              {busy ? "One moment…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="w-full text-muted hover:text-text text-xs py-1">
              {mode === "login" ? "New here? Create an account" : "Have an account? Sign in"}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted bg-surface border border-edge rounded-lg p-4">
              No backend connected yet. Explore in demo mode — offline tools work now, and you can
              connect your Apps Script backend later in <span className="text-text">Settings</span>.
            </p>
            <button onClick={enterDemo}
              className="w-full bg-orange hover:bg-orange-soft text-ink font-semibold rounded-lg py-2.5 text-sm transition-colors">
              Continue in demo mode
            </button>
          </div>
        )}
        <p className="mt-10 text-center font-mono text-[10px] text-muted/70">inno4te · Team21 Academy</p>
      </div>
    </div>
  );
}

function ModuleFallback() {
  return <div className="p-8 text-muted text-sm animate-pulse">Loading module…</div>;
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Login />;

  return (
    <Layout>
      <Suspense fallback={<ModuleFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to={registry[0].route} replace />} />
          {registry.map(m => <Route key={m.id} path={m.route} element={<m.component />} />)}
          <Route path="*" element={<Navigate to={registry[0].route} replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
