const { getSupabase } = require("./_supabase");
const { createToken, setCookieHeader } = require("./_auth");
const { verifyPassword } = require("./_password");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  const { password } = req.body || {};
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("site_data")
    .select("password_hash,password_plain")
    .eq("id", 1)
    .single();
  if (error || !data) return res.status(500).json({ ok: false, error: "db_error" });

  const valid = await verifyPassword(password, data);
  if (!valid) return res.status(401).json({ ok: false, error: "wrong_password" });

  const token = createToken();
  setCookieHeader(res, token);
  res.status(200).json({ ok: true });
};
