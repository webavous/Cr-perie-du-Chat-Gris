const { clearCookieHeader } = require("./_auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  clearCookieHeader(res);
  res.status(200).json({ ok: true });
};
