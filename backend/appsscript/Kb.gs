/**
 * Knowledge base = the "kb" tab in the Team21 Workspace DB spreadsheet.
 * Columns: topic | content | active
 * Anyone on the team edits the sheet directly — the Coach picks it up automatically.
 */

var KB_MAX_CHARS = 30000; // keeps prompts inside free-tier token limits

function kbSheet() {
  var id = PropertiesService.getScriptProperties().getProperty("DB_ID");
  var ss = SpreadsheetApp.openById(id);
  var sh = ss.getSheetByName("kb");
  if (!sh) {
    sh = ss.insertSheet("kb");
    sh.appendRow(["topic", "content", "active"]);
    sh.appendRow(["About Team21 Academy",
      "Team21 Academy (inno4te) is a training academy founded by Innocent Forteh, based in Yaounde, Cameroon, " +
      "with a US enterprise edition (T21 Institute). Contact: team21online@gmail.com, WhatsApp +237 694 294 406.",
      "yes"]);
    sh.appendRow(["Courses",
      "Catalog includes: AI Unlocked Level 1, AI Unlocked Level 2, Vibe Coding Mastery, No-Code Builder Lab, " +
      "15 AI Unlocked Specializations, and Python Programming (30 modules, 120 labs, 240 MCQs).",
      "yes"]);
    sh.appendRow(["EDIT ME - Fees and schedules",
      "Add current fees, start dates and class schedules here. The Coach will use exactly what you write.",
      "no"]);
  }
  return sh;
}

function kbGet(user) {
  var data = kbSheet().getDataRange().getValues();
  var parts = [], topics = 0, total = 0;
  for (var r = 1; r < data.length; r++) {
    var topic = String(data[r][0] || "").trim();
    var content = String(data[r][1] || "").trim();
    var active = String(data[r][2] || "").toLowerCase();
    if (!topic || !content || (active !== "yes" && active !== "true" && active !== "1")) continue;
    var block = "## " + topic + "\n" + content;
    if (total + block.length > KB_MAX_CHARS) break;
    parts.push(block); total += block.length; topics++;
  }
  return { text: parts.join("\n\n"), topics: topics, updatedAt: new Date().toISOString() };
}
