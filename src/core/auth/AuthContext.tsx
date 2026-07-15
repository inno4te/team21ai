import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, hasBackend, setToken, clearToken, getToken } from "../../services/backend";

export interface User { id: string; name: string; email: string; role: "student" | "instructor" | "admin"; demo?: boolean; }

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  enterDemo: () => void;
  logout: () => void;
}

const Ctx = createContext<AuthState>(null!);
export const useAuth = () => useContext(Ctx);

const USER_KEY = "t21.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(USER_KEY);
    if (cached && (getToken() || JSON.parse(cached).demo)) setUser(JSON.parse(cached));
    setLoading(false);
  }, []);

  const persist = (u: User) => { localStorage.setItem(USER_KEY, JSON.stringify(u)); setUser(u); };

  const login = async (email: string, password: string) => {
    const r = await api<{ token: string; user: User }>("auth.login", { email, password });
    setToken(r.token); persist(r.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const r = await api<{ token: string; user: User }>("auth.register", { name, email, password });
    setToken(r.token); persist(r.user);
  };

  const enterDemo = () => persist({ id: "demo", name: "Guest", email: "", role: "student", demo: true });

  const logout = () => { clearToken(); localStorage.removeItem(USER_KEY); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, register, enterDemo, logout }}>{children}</Ctx.Provider>;
}

export { hasBackend };
