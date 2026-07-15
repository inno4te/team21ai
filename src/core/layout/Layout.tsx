import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LogOut, WifiOff } from "lucide-react";
import { registry } from "../moduleRegistry";
import { useAuth } from "../auth/AuthContext";

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true), down = () => setOnline(false);
    window.addEventListener("online", up); window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);
  return online;
}

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const online = useOnline();
  const { pathname } = useLocation();
  const current = registry.find(m => pathname.startsWith(m.route));

  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-ink">
      {/* Sidebar (desktop) / bottom bar (mobile) */}
      <nav className="order-last md:order-first md:w-60 shrink-0 border-t md:border-t-0 md:border-r border-edge bg-surface/60 backdrop-blur flex md:flex-col fixed md:static bottom-0 inset-x-0 z-20">
        <div className="hidden md:flex items-baseline gap-2 px-5 pt-6 pb-5">
          <span className="font-display font-extrabold text-2xl tracking-tight">T21</span>
          <span className="text-muted text-sm">Workspace</span>
        </div>

        <ul className="flex md:flex-col flex-1 justify-around md:justify-start md:px-3 md:gap-1">
          {registry.map(m => (
            <li key={m.id}>
              <NavLink
                to={m.route}
                className={({ isActive }) =>
                  "relative flex md:flex-row flex-col items-center gap-1.5 md:gap-3 px-3 md:px-3 py-2.5 rounded-lg text-xs md:text-sm transition-colors " +
                  (isActive ? "text-text md:bg-raised" : "text-muted hover:text-text")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="hidden md:block absolute left-0 top-2 bottom-2 w-0.5 rounded bg-orange" />}
                    <m.icon size={18} className={isActive ? "text-orange" : ""} />
                    <span>{m.title}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block px-5 py-4 border-t border-edge text-xs text-muted">
          <div className="flex items-center justify-between">
            <span className="truncate">{user?.name}</span>
            <button onClick={logout} title="Sign out" className="hover:text-orange"><LogOut size={14} /></button>
          </div>
          <p className="mt-2 font-mono text-[10px] opacity-70">inno4te · Team21 Academy</p>
        </div>
      </nav>

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <header className="h-14 shrink-0 border-b border-edge flex items-center justify-between px-4 md:px-6">
          <h1 className="font-display font-bold text-lg">{current?.title ?? "Home"}</h1>
          <div className="flex items-center gap-3 text-xs text-muted">
            {!online && (
              <span className="flex items-center gap-1.5 text-orange-soft"><WifiOff size={13} /> Offline — local tools still work</span>
            )}
            {online && <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online</span>}
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
