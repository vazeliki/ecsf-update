# Extended ECSF — Cybersecurity Role Profiles

A static website for the Extended ECSF: 12 role profiles and 20 skill areas,
each skill area scored across four proficiency levels, with roles and skill
areas cross-linked in both directions.

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
- **ECSF Profiles** (`#/roles`) — searchable grid of all 12 profiles
- **Profile detail** (`#/role/<slug>`) — tasks + skill areas (with that role's
  level in each one), links through to each skill area
- **Skill Areas** (`#/skills`) — searchable grid of all 20 skill areas
- **Skill detail** (`#/skill/<id>`) — L1–L4 proficiency progression, plus every
  role that uses this skill and at what level


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
