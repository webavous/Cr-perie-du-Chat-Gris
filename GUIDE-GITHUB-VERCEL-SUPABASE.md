# Mettre le site en ligne gratuitement avec GitHub + Vercel + Supabase

Cette solution est même **meilleure** que l'hébergement classique gratuit : c'est rapide, fiable, sans publicité, et vous pourrez brancher un vrai nom de domaine (`creperieduchatgris.fr`) **gratuitement** plus tard (seul l'achat du nom de domaine sera payant, l'hébergement restera gratuit).

Trois comptes gratuits à créer, dans cet ordre : **GitHub** (stocke les fichiers du site) → **Supabase** (stocke les horaires/carte/mots de passe) → **Vercel** (fait tourner le site en ligne). Aucune ligne de code à écrire, tout est déjà prêt.

---

## Étape 1 — GitHub : déposer les fichiers du site

1. Allez sur **[github.com](https://github.com)** et créez un compte gratuit.
2. Cliquez sur le **+** en haut à droite → **"New repository"**.
3. Donnez-lui un nom, par exemple `creperie-du-chat-gris`. Laissez-le "Public" ou "Private" (peu importe). Ne cochez aucune case supplémentaire. Cliquez **"Create repository"**.
4. Sur la page du dépôt vide, cliquez **"uploading an existing file"** (ou allez dans **Add file → Upload files**).
5. Glissez-déposez **tout le contenu** du dossier `deploy-vercel` que je vous ai fourni (le contenu, pas le dossier lui-même) : `index.html`, `package.json`, le dossier `api/` entier, le dossier `assets/` entier.
6. En bas de page, cliquez **"Commit changes"** pour valider l'envoi.

## Étape 2 — Supabase : créer la base de données

1. Allez sur **[supabase.com](https://supabase.com)** et créez un compte gratuit (vous pouvez vous connecter directement avec GitHub).
2. Cliquez **"New project"**. Donnez-lui un nom (ex : `chat-gris`), choisissez un mot de passe de base de données (notez-le quelque part, pas besoin de s'en souvenir après), choisissez une région proche (Europe). Cliquez **"Create new project"** — patientez 1 à 2 minutes.
3. Une fois le projet prêt, dans le menu de gauche, cliquez sur **"SQL Editor"** puis **"New query"**.
4. Ouvrez le fichier `supabase-setup.sql` que je vous ai fourni, copiez tout son contenu, collez-le dans l'éditeur SQL de Supabase.
5. Cliquez **"Run"** (ou Ctrl+Entrée). Vous devez voir un message de succès. C'est fait : votre base de données contient déjà vos horaires, votre carte de départ, et le mot de passe temporaire.
6. Allez dans **Project Settings** (icône ⚙️ en bas du menu de gauche) → **"API"**. Notez précieusement deux informations, vous en aurez besoin à l'étape suivante :
   - **Project URL** (ressemble à `https://xxxxxxxxxxxxx.supabase.co`)
   - **service_role key** (une longue chaîne de caractères, dans la section "Project API keys" — ⚠️ prenez bien la clé **`service_role`**, pas la clé `anon public`)

⚠️ La clé `service_role` est secrète : elle donne un accès complet à votre base de données. Ne la partagez jamais publiquement (ne la collez pas dans un message public, un post, etc.). Elle ne servira que dans l'étape suivante, dans un endroit protégé.

## Étape 3 — Vercel : mettre le site en ligne

1. Allez sur **[vercel.com](https://vercel.com)** et créez un compte gratuit en vous connectant **avec votre compte GitHub** (bouton "Continue with GitHub").
2. Cliquez **"Add New..."** → **"Project"**.
3. Retrouvez votre dépôt `creperie-du-chat-gris` dans la liste et cliquez **"Import"**.
4. Avant de cliquer sur Deploy, ouvrez la section **"Environment Variables"** et ajoutez ces trois variables (nom à gauche, valeur à droite) :

   | Nom | Valeur |
   |---|---|
   | `SUPABASE_URL` | l'URL notée à l'étape 2 (ex : `https://xxxxx.supabase.co`) |
   | `SUPABASE_SERVICE_KEY` | la clé `service_role` notée à l'étape 2 |
   | `SESSION_SECRET` | une phrase secrète inventée par vous, ex : `chat-gris-segre-2026-xyz-987` (n'importe quoi de long et unique, ça sert juste à sécuriser la connexion) |

5. Cliquez **"Deploy"**. Patientez 1 à 2 minutes.
6. Une fois terminé, cliquez **"Visit"** — vous obtenez une adresse du type `https://creperie-du-chat-gris.vercel.app`. Votre site est en ligne !

## Étape 4 — Tester

1. Ouvrez votre site en ligne.
2. Cliquez sur **"Espace professionnel"** en bas de page.
3. Connectez-vous avec le mot de passe temporaire : **`ChatGris2026`**
4. Allez dans l'onglet **"Mon compte"** et changez-le immédiatement.
5. Testez une modification (horaires, carte...) et vérifiez qu'elle s'affiche bien après rafraîchissement de la page.

---

## Ajouter votre vrai nom de domaine (`.fr`) plus tard — gratuitement

Quand vous serez prêt(e) :
1. Achetez un nom de domaine chez n'importe quel registraire (OVH, Gandi, Ionos...) — c'est la seule dépense, environ 10-15 €/an.
2. Dans Vercel, ouvrez votre projet → **Settings → Domains** → tapez votre nom de domaine → suivez les instructions (ajouter 1 ou 2 lignes DNS chez votre registraire).
3. Vercel s'occupe du certificat de sécurité (HTTPS) automatiquement, gratuitement.

L'hébergement Vercel reste gratuit même avec votre propre nom de domaine.

## Après une modification du site par Claude

Si un jour on modifie encore le site ensemble, il suffira de renvoyer les fichiers mis à jour sur GitHub (bouton **"Upload files"** à nouveau, ou en remplaçant les fichiers existants) — Vercel republie automatiquement le site à chaque changement sur GitHub, en 1 minute environ.

## En cas de souci

- **La page reste blanche / erreur au clic sur "Espace professionnel"** : vérifiez les 3 variables d'environnement dans Vercel (Settings → Environment Variables), notamment que la clé Supabase est bien la `service_role` et pas la `anon`.
- **"Erreur base de données"** : retournez dans Supabase → SQL Editor, vérifiez que le script `supabase-setup.sql` s'est bien exécuté sans erreur (relancez-le si besoin, il ne dupliquera rien).
- Après avoir changé une variable d'environnement dans Vercel, il faut redéployer : Vercel → Deployments → "..." sur le dernier déploiement → **"Redeploy"**.
