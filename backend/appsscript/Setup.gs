/** Run setup() ONCE from the editor. Creates the database spreadsheet + tabs
 *  and stores its id. Then set your LLM keys in Project Settings → Script Properties:
 *  GEMINI_KEY (aistudio.google.com) · GROQ_KEY (console.groq.com) · CEREBRAS_KEY (cloud.cerebras.ai)
 */
function setup() {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty("DB_ID")) return "Already set up.";
  var ss = SpreadsheetApp.create("Team21 Workspace DB");
  var tabs = {
    users:    ["user_id", "email", "name", "role", "pass_hash", "salt", "created_at"],
    sessions: ["token", "user_id", "expires_at"],
    quotas:   ["user_id", "date", "requests"],
    log:      ["ts", "user_id", "provider", "tokens"]
  };
  Object.keys(tabs).forEach(function (name, i) {
    var sh = i === 0 ? ss.getSheets()[0].setName(name) : ss.insertSheet(name);
    sh.appendRow(tabs[name]);
  });
  props.setProperty("DB_ID", ss.getId());
  return "Created DB: " + ss.getUrl();
}

function db(tab) {
  var id = PropertiesService.getScriptProperties().getProperty("DB_ID");
  if (!id) throw new Error("Run setup() first.");
  return SpreadsheetApp.openById(id).getSheetByName(tab);
}

function findRow(tab, col, value) {
  var sh = db(tab), data = sh.getDataRange().getValues(), head = data[0];
  var ci = head.indexOf(col);
  for (var r = 1; r < data.length; r++) {
    if (String(data[r][ci]) === String(value)) {
      var obj = { _row: r + 1 };
      head.forEach(function (h, i) { obj[h] = data[r][i]; });
      return obj;
    }
  }
  return null;
}
