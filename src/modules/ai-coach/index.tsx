import { useEffect, useState } from "react";
import { BookOpenCheck } from "lucide-react";
import ChatView from "../../components/ChatView";
import { getKb, type Kb } from "../../services/kb";

const BASE_CONTEXT =
  "You are the Team21 AI Coach for Team21 Academy (inno4te), a training academy in Cameroon with a US edition. " +
  "Be encouraging and practical. Ground every factual claim about Team21 in the knowledge base below. " +
  "If the knowledge base does not contain the answer (e.g. specific fees or dates), say so and point the student " +
  "to team21online@gmail.com rather than guessing.";

export default function AiCoach() {
  const [kb, setKb] = useState<Kb | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { getKb().then(k => { setKb(k); setLoaded(true); }); }, []);

  const context = kb?.text
    ? BASE_CONTEXT + "\n\n=== TEAM21 KNOWLEDGE BASE ===\n" + kb.text
    : BASE_CONTEXT + "\n\nKnown courses: AI Unlocked Levels 1 & 2, Vibe Coding Mastery, No-Code Builder Lab, " +
      "15 AI Unlocked Specializations, Python Programming (30 modules).";

  return (
    <div className="h-full flex flex-col">
      {loaded && (
        <div className="shrink-0 flex items-center gap-1.5 justify-center pt-2 text-[11px] text-muted">
          <BookOpenCheck size={12} className={kb ? "text-emerald-400" : "text-orange-soft"} />
          {kb ? `Knowledge base loaded · ${kb.topics} topics` : "Using built-in basics — connect backend for the full knowledge base"}
        </div>
      )}
      <div className="flex-1 min-h-0">
        <ChatView
          storageKey="t21.chat.coach"
          systemHint="Ask me about Team21 Academy"
          placeholder="Courses, programs, schedules, policies…"
          quickChips={[
            "Which course should I start with?",
            "What is AI Unlocked Level 2 about?",
            "How do the specializations work?",
            "Tell me about Team21 Academy"
          ]}
          context={context}
        />
      </div>
    </div>
  );
}
