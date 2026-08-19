-- À exécuter une seule fois dans l'éditeur SQL de Supabase (SQL Editor > New query)

create table if not exists site_data (
  id integer primary key,
  hours jsonb not null,
  closure jsonb not null,
  specials jsonb not null,
  menu jsonb not null,
  password_hash text,
  password_plain text
);

-- Sécurité : on bloque tout accès public direct à la table.
-- Le site ne l'interroge jamais que via l'API (clé secrète côté serveur).
alter table site_data enable row level security;

insert into site_data (id, hours, closure, specials, menu, password_hash, password_plain)
values (
  1,
  '[
    { "closed": true,  "slots": [{ "start": "", "end": "" }, { "start": "", "end": "" }] },
    { "closed": true,  "slots": [{ "start": "", "end": "" }, { "start": "", "end": "" }] },
    { "closed": false, "slots": [{ "start": "11:30", "end": "14:00" }, { "start": "19:00", "end": "21:00" }] },
    { "closed": false, "slots": [{ "start": "11:30", "end": "14:00" }, { "start": "19:00", "end": "21:00" }] },
    { "closed": false, "slots": [{ "start": "11:30", "end": "14:00" }, { "start": "19:00", "end": "21:00" }] },
    { "closed": false, "slots": [{ "start": "11:30", "end": "14:00" }, { "start": "19:00", "end": "21:00" }] },
    { "closed": false, "slots": [{ "start": "11:30", "end": "14:00" }, { "start": "19:00", "end": "21:30" }] }
  ]'::jsonb,
  '{ "active": false, "message": "" }'::jsonb,
  '{
    "galette": { "name": "", "desc": "", "price": "" },
    "crepe": { "name": "", "desc": "", "price": "" }
  }'::jsonb,
  '{
    "galettes": [
      { "name": "Complète", "desc": "Jambon, œuf, emmental", "price": "9,50 €" },
      { "name": "Forestière", "desc": "Champignons, crème, persillade", "price": "10,50 €" },
      { "name": "Andouille de pays", "desc": "Oignons confits, moutarde à l''ancienne", "price": "11,50 €" },
      { "name": "Chèvre miel", "desc": "Chèvre chaud, miel, noix", "price": "10,90 €" }
    ],
    "crepes": [
      { "name": "Sucre — beurre", "desc": "", "price": "4,00 €" },
      { "name": "Caramel au beurre salé", "desc": "", "price": "5,50 €" },
      { "name": "Pomme flambée au calvados", "desc": "", "price": "6,50 €" },
      { "name": "Chocolat maison, chantilly", "desc": "", "price": "6,00 €" }
    ],
    "boissons": [
      { "name": "Cidre brut fermier, la bolée", "desc": "", "price": "3,50 €" },
      { "name": "Jus de pomme artisanal", "desc": "", "price": "3,00 €" },
      { "name": "Menu enfant", "desc": "Crêpe + boisson + dessert", "price": "9,90 €" },
      { "name": "Menu adulte du jour", "desc": "Midi en semaine", "price": "10,90–20 €" }
    ]
  }'::jsonb,
  null,
  'ChatGris2026'
)
on conflict (id) do nothing;
