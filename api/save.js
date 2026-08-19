const { getSupabase } = require("./_supabase");
const { verifyToken, getTokenFromReq } = require("./_auth");

const ALLOWED = ["hours", "closure", "specials", "menu", "gallery"];

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const token = getTokenFromReq(req);
  if (!verifyToken(token)) return res.status(403).json({ ok: false, error: "not_authenticated" });

  const { key, value } = req.body || {};
  if (!ALLOWED.includes(key)) return res.status(400).json({ ok: false, error: "invalid_key" });

  const supabase = getSupabase();
  const update = {};
  update[key] = value;
  const { error } = await supabase.from("site_data").update(update).eq("id", 1);
  if (error) return res.status(500).json({ ok: false, error: "db_error" });

  res.status(200).json({ ok: true });
};
