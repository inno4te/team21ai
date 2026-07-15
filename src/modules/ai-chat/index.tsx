import ChatView from "../../components/ChatView";

export default function AiChat() {
  return (
    <ChatView
      storageKey="t21.chat.general"
      systemHint="What are we working on today?"
      placeholder="Write, plan, brainstorm…"
      quickChips={[
        "Draft a professional email",
        "Brainstorm a business idea",
        "Explain a concept simply",
        "Plan my study week"
      ]}
    />
  );
}
