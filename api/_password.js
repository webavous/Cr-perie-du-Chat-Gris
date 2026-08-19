const bcrypt = require("bcryptjs");
const { getSupabase } = require("./_supabase");

/**
 * Vérifie le mot de passe. Si la ligne ne contient encore qu'un mot de passe
 * en clair (premier démarrage), on le transforme en hash sécurisé dès qu'il
 * est vérifié avec succès — comme ça, pas besoin de pré-calculer un hash.
 */
async function verifyPassword(input, row) {
  if (row.password_hash) {
    return bcrypt.compare(input || "", row.password_hash);
  }
  if (row.password_plain) {
    if (input === row.password_plain) {
      const newHash = await bcrypt.hash(input, 10);
      const supabase = getSupabase();
      await supabase
        .from("site_data")
        .update({ password_hash: newHash, password_plain: null })
        .eq("id", 1);
      return true;
    }
  }
  return false;
}

module.exports = { verifyPassword };
