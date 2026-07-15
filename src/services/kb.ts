import { api } from "./backend";

export interface Kb { text: string; topics: number; updatedAt: string; }

const KEY = "t21.kb";
const TTL_MS = 60 * 60 * 1000; // refresh hourly — edit the Sheet, Coach follows within the hour

/** Fetches the Team21 knowledge base, cached locally so repeat questions cost nothing. */
export async function getKb(): Promise<Kb | null> {
  try {
    const cached = localStorage.getItem(KEY);
    if (cached) {
      const { at, kb } = JSON.parse(cached) as { at: number; kb: Kb };
      if (Date.now() - at < TTL_MS) return kb;
    }
  } catch { /* fall through to fetch */ }
  try {
    const kb = await api<Kb>("kb.get");
    localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), kb }));
    return kb;
  } catch {
    return null; // demo mode / offline — Coach falls back to built-in basics
  }
}

export function clearKbCache() { localStorage.removeItem(KEY); }
