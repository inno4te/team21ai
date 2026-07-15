/**
 * The free-tier LLM ROUTER. Tries providers in order; any 429/5xx/timeout
 * falls through to the next. API keys live ONLY in Script Properties.
 */

var SYSTEM_PROMPT =
  "You are the Team21 AI assistant by inno4te - Team21 Academy. Be clear, warm and practical. " +
  "Answer in the user's language (English or French). If context is provided, ground your answer " +
  "in it and do not invent facts about Team21 courses, fees or schedules.";

function llmChat(user, messages, context) {
  if (!messages || !messages.length) throw new Error("No message to answer.");
  enforceQuota(user);

  var providers = buildProviders();
  var lastErr = null;
  for (var i = 0; i < providers.length; i++) {
    var p = providers[i];
    if (!p.key) continue; // key not configured — skip silently
    try {
      var res = p.call(messages, context);
      db("log").appendRow([new Date(), user.user_id, p.name, res.tokens || 0]);
      return { text: res.text, provider: p.name, tokensUsed: res.tokens || 0 };
    } catch (err) { lastErr = err; }
  }
  throw new Error("All free providers are busy right now — please try again in a minute." +
    (lastErr ? " (" + String(lastErr.message || lastErr).slice(0, 120) + ")" : ""));
}

function buildProviders() {
  var props = PropertiesService.getScriptProperties();
  return [
    { name: "gemini-2.5-flash", key: props.getProperty("GEMINI_KEY"),
      call: function (m, c) { return callGemini(this.key, m, c); } },
    { name: "groq/llama-3.3-70b", key: props.getProperty("GROQ_KEY"),
      call: function (m, c) { return callOpenAICompat(this.key, "https://api.groq.com/openai/v1/chat/completions", "llama-3.3-70b-versatile", m, c); } },
    { name: "cerebras/llama-3.3-70b", key: props.getProperty("CEREBRAS_KEY"),
      call: function (m, c) { return callOpenAICompat(this.key, "https://api.cerebras.ai/v1/chat/completions", "llama-3.3-70b", m, c); } }
  ];
}

function systemWithContext(context) {
  return context ? SYSTEM_PROMPT + "\n\nCONTEXT:\n" + context : SYSTEM_PROMPT;
}

function callGemini(key, messages, context) {
  var contents = messages.map(function (m) {
    return { role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] };
  });
  var resp = UrlFetchApp.fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key,
    { method: "post", contentType: "application/json", muteHttpExceptions: true,
      payload: JSON.stringify({
        system_instruction: { parts: [{ text: systemWithContext(context) }] },
        contents: contents,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
      }) });
  if (resp.getResponseCode() >= 400) throw new Error("gemini " + resp.getResponseCode());
  var data = JSON.parse(resp.getContentText());
  var text = data.candidates && data.candidates[0] && data.candidates[0].content &&
             data.candidates[0].content.parts.map(function (p) { return p.text || ""; }).join("");
  if (!text) throw new Error("gemini empty response");
  var tokens = data.usageMetadata ? data.usageMetadata.totalTokenCount : 0;
  return { text: text, tokens: tokens };
}

function callOpenAICompat(key, url, model, messages, context) {
  var msgs = [{ role: "system", content: systemWithContext(context) }].concat(
    messages.map(function (m) { return { role: m.role, content: m.content }; }));
  var resp = UrlFetchApp.fetch(url, {
    method: "post", contentType: "application/json", muteHttpExceptions: true,
    headers: { Authorization: "Bearer " + key },
    payload: JSON.stringify({ model: model, messages: msgs, max_tokens: 1024, temperature: 0.7 })
  });
  if (resp.getResponseCode() >= 400) throw new Error(model + " " + resp.getResponseCode());
  var data = JSON.parse(resp.getContentText());
  var text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!text) throw new Error(model + " empty response");
  return { text: text, tokens: data.usage ? data.usage.total_tokens : 0 };
}
