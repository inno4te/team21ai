var SESSION_DAYS = 30;

function hash(password, salt) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + password);
  return raw.map(function (b) { return ((b + 256) % 256).toString(16).slice(-2).padStart(2, "0"); }).join("");
}

function authRegister(name, email, password) {
  email = String(email || "").toLowerCase().trim();
  if (!name || !email || !password || password.length < 6) throw new Error("Name, email and a 6+ character password are required.");
  if (findRow("users", "email", email)) throw new Error("An account with this email already exists.");
  var salt = Utilities.getUuid(), id = Utilities.getUuid();
  db("users").appendRow([id, email, name, "student", hash(password, salt), salt, new Date()]);
  return issueSession({ user_id: id, email: email, name: name, role: "student" });
}

function authLogin(email, password) {
  email = String(email || "").toLowerCase().trim();
  var u = findRow("users", "email", email);
  if (!u || hash(password, u.salt) !== u.pass_hash) throw new Error("Email or password is incorrect.");
  return issueSession(u);
}

function issueSession(u) {
  var token = Utilities.getUuid();
  var expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  db("sessions").appendRow([token, u.user_id, expires]);
  return { token: token, user: { id: u.user_id, name: u.name, email: u.email, role: u.role } };
}

function requireUser(token) {
  if (!token) throw new Error("Please sign in.");
  var s = findRow("sessions", "token", token);
  if (!s || new Date(s.expires_at) < new Date()) throw new Error("Session expired — please sign in again.");
  var u = findRow("users", "user_id", s.user_id);
  if (!u) throw new Error("Account not found.");
  return u;
}
