var DAILY_LIMIT = 40; // LLM requests per user per day — protects the shared free tier

function todayKey() {
  return Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
}

function enforceQuota(user) {
  var key = user.user_id + "|" + todayKey();
  var row = findRow("quotas", "user_id", key);
  var used = row ? Number(row.requests) : 0;
  if (used >= DAILY_LIMIT) {
    var e = new Error("Daily limit reached (" + DAILY_LIMIT + " requests). Resets at midnight GMT.");
    e.code = "QUOTA"; throw e;
  }
  if (row) db("quotas").getRange(row._row, 3).setValue(used + 1);
  else db("quotas").appendRow([key, todayKey(), 1]);
}

function quotaStatus(user) {
  var row = findRow("quotas", "user_id", user.user_id + "|" + todayKey());
  return { used: row ? Number(row.requests) : 0, limit: DAILY_LIMIT, resetsAt: todayKey() + "T24:00Z" };
}
