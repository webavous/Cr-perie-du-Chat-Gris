const crypto = require("crypto");

const SECRET = process.env.SESSION_SECRET || "change-me";
const COOKIE_NAME = "cg_session";
const MAX_AGE_MS = 1000 * 60 * 60 * 12; // 12 heures

function createToken() {
  const payload = JSON.stringify({ admin: true, exp: Date.now() + MAX_AGE_MS });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

function verifyToken(token) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [b64, sig] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  if (sig !== expected) return false;
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString());
    if (!payload.admin) return false;
    if (Date.now() > payload.exp) return false;
    return true;
  } catch (e) {
    return false;
  }
}

function setCookieHeader(res, token) {
  const maxAgeSec = Math.floor(MAX_AGE_MS / 1000);
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax; Secure`
  );
}

function clearCookieHeader(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`
  );
}

function getTokenFromReq(req) {
  const cookieHeader = req.headers.cookie || "";
  const found = cookieHeader
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(COOKIE_NAME + "="));
  if (!found) return null;
  return found.substring((COOKIE_NAME + "=").length);
}

module.exports = { createToken, verifyToken, setCookieHeader, clearCookieHeader, getTokenFromReq };
