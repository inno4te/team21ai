import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { GraduationCap, FileText, MessageSquare, BookMarked, Settings, type LucideIcon } from "lucide-react";

export interface WorkspaceModule {
  id: string;
  title: string;
  tagline: string;               // one-line purpose, shown on Home
  icon: LucideIcon;
  route: string;
  component: LazyExoticComponent<ComponentType>;
  offline: boolean;              // usable without network?
  minRole: "student" | "instructor" | "admin";
}

/**
 * THE extension point. Adding a future module (Word, Excel, Image, Audio…)
 * = one folder in src/modules + one entry here. The shell does the rest.
 */
export const registry: WorkspaceModule[] = [
  {
    id: "ai-coach", title: "AI Coach", tagline: "Ask anything about Team21 courses, programs and policies",
    icon: GraduationCap, route: "/coach",
    component: lazy(() => import("../modules/ai-coach")), offline: false, minRole: "student"
  },
  {
    id: "pdf-tools", title: "PDF Tools", tagline: "Read, merge, split and OCR — files never leave your device",
    icon: FileText, route: "/pdf",
    component: lazy(() => import("../modules/pdf-tools")), offline: true, minRole: "student"
  },
  {
    id: "ai-chat", title: "AI Chat", tagline: "General assistant for writing, planning and ideas",
    icon: MessageSquare, route: "/chat",
    component: lazy(() => import("../modules/ai-chat")), offline: false, minRole: "student"
  },
  {
    id: "prompts", title: "Prompt Library", tagline: "Your saved prompts, ready to reuse — works offline",
    icon: BookMarked, route: "/prompts",
    component: lazy(() => import("../modules/prompt-library")), offline: true, minRole: "student"
  },
  {
    id: "settings", title: "Settings", tagline: "Backend, account and language",
    icon: Settings, route: "/settings",
    component: lazy(() => import("../modules/settings")), offline: true, minRole: "student"
  }
];
