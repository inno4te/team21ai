// Prompt Library — local-first (works offline), sync to backend arrives post-MVP.
export interface Prompt { id: string; title: string; body: string; category: string; updatedAt: number; }

const KEY = "t21.prompts";

const seed: Prompt[] = [
  { id: "p1", title: "Course recommender", category: "Academy",
    body: "I want to grow in [skill]. Based on Team21 Academy's catalog, which course fits me and why?", updatedAt: 0 },
  { id: "p2", title: "Assignment coach", category: "Study",
    body: "Guide me through this assignment step by step without giving the final answer outright:\n\n[paste assignment]", updatedAt: 0 },
  { id: "p3", title: "Professional email", category: "Work",
    body: "Draft a clear, warm, professional email to [who] about [what]. Keep it under 150 words.", updatedAt: 0 },
  { id: "p4", title: "Business idea stress test", category: "Entrepreneurship",
    body: "Act as an entrepreneurship coach. Stress-test this idea for the Cameroonian market: [idea]. Cover demand, pricing, and first 3 customers.", updatedAt: 0 }
];

export function loadPrompts(): Prompt[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed; }
  try { return JSON.parse(raw) as Prompt[]; } catch { return seed; }
}

export function savePrompts(list: Prompt[]) { localStorage.setItem(KEY, JSON.stringify(list)); }
