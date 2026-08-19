const bcrypt = require("bcryptjs");
const { getSupabase } = require("./_supabase");
const { verifyToken, getTokenFromReq } = require("./_auth");
const { verifyPassword } = require("./_password");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const token = getTokenFromReq(req);
  if (!verifyToken(token)) return res.status(403).json({ ok: false, error: "not_authenticated" });

  const { current, next } = req.body || {};
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("site_data")
    .select("password_hash,password_plain")
    .eq("id", 1)
    .single();
  if (error || !data) return res.status(500).json({ ok: false, error: "db_error" });

  const valid = await verifyPassword(current, data);
  if (!valid) return res.status(401).json({ ok: false, error: "wrong_current" });
  if (!next || next.length < 6) return res.status(400).json({ ok: false, error: "too_short" });

  const newHash = await bcrypt.hash(next, 10);
  const { error: updateError } = await supabase
    .from("site_data")
    .update({ password_hash: newHash, password_plain: null })
    .eq("id", 1);
  if (updateError) return res.status(500).json({ ok: false, error: "db_error" });

  res.status(200).json({ ok: true });
};
