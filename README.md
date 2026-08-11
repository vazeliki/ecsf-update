# Extended ECSF — Cybersecurity Role Profiles

A static website for the Extended ECSF: 12 role profiles and 20 skill areas,
each skill area scored across four proficiency levels, with roles and skill
areas cross-linked in both directions.

## What changed in this fix

Your `data.js` and `styles.css` had been rebuilt with a new structure — a
richer `window.ECSF_DATA.roles` / `.skills` schema (including per-role
proficiency levels) and a new class-name scheme (`.topbar`, `.role-card`,
`.detail-grid`, `.progression`, etc.). The `index.html` and `app.js` hadn't
been updated to match, so the page had no matching markup or rendering logic
for the new data/CSS — that's why it wasn't displaying. I rebuilt
`index.html` and `app.js` from scratch to use every class in your CSS and
render your new data schema, including the per-role proficiency levels and
the "roles that use this skill" back-links, which weren't wired up before.

I also added one small CSS breakpoint (`max-width:480px`) — the hero stats
row was clipping on narrow phones (~390px wide); it now stacks with more
breathing room below that width.

Later updates: added short skill-area descriptions (from your spreadsheet's
column B), removed the "(as in ECSF)" note under Tasks, and restyled the
Roles page to match ENISA's own ECSF Tool profile-card design — icon,
colored title, summary, "[more]" — using the actual icons and colors from
ENISA's source data. Then: switched the profile grid to 4 columns, updated
all 12 summary statements to the revised text, simplified the home page to
just the ECSF logo, an explanatory paragraph, and one "Explore the ECSF
profiles" button, and renamed "Roles" to "ECSF Profiles" throughout the nav,
headings, search placeholder, and back links.

## File structure

```
.
├── index.html          # page shell, nav, all view containers
├── assets/
│   ├── styles.css        # your styling (unchanged, +1 small mobile breakpoint)
│   ├── data.js              # your role/skill data (unchanged)
│   └── app.js                  # rendering + hash routing (rebuilt to match)
└── README.md
```

## Pages

- **Home** (`#/`) — hero, "how this works" cards, proficiency-level legend
- **Roles** (`#/roles`) — searchable grid of all 12 profiles
- **Role detail** (`#/role/<slug>`) — tasks + skill areas (with that role's
  level in each one), links through to each skill area
- **Skill Areas** (`#/skills`) — searchable grid of all 20 skill areas
- **Skill detail** (`#/skill/<id>`) — L1–L4 proficiency progression, plus every
  role that uses this skill and at what level

## Publish it on GitHub Pages

### 1. Create a repository
1. Go to [github.com/new](https://github.com/new).
2. Name it whatever you like (e.g. `ecsf-profiles`).
3. Leave it **Public** (GitHub Pages needs a public repo, unless you're on a paid plan).
4. Don't initialize with a README. Click **Create repository**.

### 2. Upload the files
**No git needed:**
1. On the repo page, click **uploading an existing file**.
2. Drag in `index.html`, `README.md`, and the whole `assets` folder.
3. Commit the changes.

**Or with git:**
```bash
cd path/to/this/folder
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 3. Turn on GitHub Pages
1. **Settings** → **Pages**.
2. **Source**: Deploy from a branch. **Branch**: `main`, folder **/ (root)**. Save.
3. Wait a minute — your site goes live at:
   ```
   https://<your-username>.github.io/<your-repo>/
   ```

## Credits

The 12 role-profile icons and their colors are sourced directly from ENISA's
official [ECSF Web Tool](https://github.com/enisaeu/ECSF) (EUPL licence),
the same source as the framework data itself. The card layout on the Roles
page (icon, colored title, summary, "[more]" link) is modeled on ENISA's own
[ECSF Tool](https://enisaeu.github.io/ECSF/#/profiles) profile grid.

## Editing content later

All content lives in `assets/data.js` under `window.ECSF_DATA`:
- `roles[]` — each has `name`, `tasks[]` (`id`, `text`), and `skills[]`
  (`id`, `name`, `level` — that role's proficiency level in that skill area)
- `skills[]` — each has `id`, `name`, and `levels` (`L1`–`L4`, each with
  `name` and `description`)

Edit the JSON-like object directly and refresh — no build step. `app.js`
reads everything dynamically, so adding a new role or skill area just means
adding an entry to the right array (matching skill `id`s so the cross-links
resolve).

## Local preview

```bash
python3 -m http.server 8000
```
then open `http://localhost:8000`.
