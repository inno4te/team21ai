/**
 * Team21 AI Workspace — backend router (Google Apps Script Web App)
 * Deploy: New deployment → Web app → Execute as: Me → Access: Anyone.
 * The frontend POSTs JSON with Content-Type text/plain (no CORS preflight).
 */

function doPost(e) {
  var out;
  try {
    var req = JSON.parse(e.postData.contents);
    out = { ok: true, result: route(req) };
  } catch (err) {
    out = { ok: false, error: String(err.message || err), code: err.code || "ERROR" };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, result: "Team21 Workspace backend is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function route(req) {
  switch (req.action) {
    case "auth.login":    return authLogin(req.email, req.password);
    case "auth.register": return authRegister(req.name, req.email, req.password);
    case "llm.chat":      return llmChat(requireUser(req.token), req.messages, req.context);
    case "quota.status":  return quotaStatus(requireUser(req.token));
    case "kb.get":        return kbGet(requireUser(req.token));
    default: throw new Error("Unknown action: " + req.action);
  }
}
