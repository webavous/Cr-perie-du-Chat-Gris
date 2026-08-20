const { getSupabase } = require("./_supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("site_data")
    .select("hours,closure,specials,menu,gallery,events")
    .eq("id", 1)
    .single();
  if (error) return res.status(500).json({ error: "db_error" });
  res.status(200).json(data);
};
