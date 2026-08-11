const DATA = window.ECSF_DATA;
const ROLES = DATA.roles;
const SKILLS = DATA.skills;

// ---------- helpers ----------
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[()&,]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function esc(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}
function roleSlug(role) { return slugify(role.name); }
function findRole(slug) { return ROLES.find((r) => roleSlug(r) === slug); }
function findSkill(id) { return SKILLS.find((s) => s.id.toLowerCase() === id.toLowerCase()); }
function levelClass(lvl) { return "l" + String(lvl).replace(/\D/g, ""); }

const ROLE_CODE = {
  "Chief Information Security Officer (CISO)": "CISO",
  "Cybersecurity Auditor": "AUD",
  "Penetration Tester": "PEN",
  "Cyber Incident Responder": "IR",
  "Cybersecurity Architect": "ARC",
  "Cyber Legal, Policy & Compliance Officer": "LEG",
  "Digital Forensics Investigator": "DFI",
  "Cyber Threat Intelligence Specialist": "CTI",
  "Cybersecurity Researcher": "RES",
  "Cybersecurity Implementer": "IMP",
  "Cybersecurity Educator": "EDU",
  "Cybersecurity Risk Manager": "RM",
};

// ---------- static bits ----------
document.getElementById("footer-meta").textContent =
  (DATA.meta.title ? DATA.meta.title + " · " : "") + (DATA.meta.date ? "Updated " + DATA.meta.date : "");

// ---------- render: role grid ----------
function renderRoleGrid(filter) {
  const grid = document.getElementById("role-grid");
  const q = (filter || "").trim().toLowerCase();
  const items = ROLES.filter((r) => !q || r.name.toLowerCase().includes(q));

  if (items.length === 0) {
    grid.innerHTML = `<div class="empty">No ECSF profiles match “${esc(filter)}”.</div>`;
    return;
  }

  grid.innerHTML = items
    .map((r) => `
      <div class="role-card role-card-ecsf" data-slug="${roleSlug(r)}">
        <div class="role-card-icon">
          <img src="assets/icons/${r.icon}.svg" alt="" width="64" height="64" />
        </div>
        <h3 style="color:${r.color};">${esc(r.name)}</h3>
        <p class="role-card-summary">
          ${esc(r.summary || "")}
        </p>
      </div>`)
    .join("");

  grid.querySelectorAll(".role-card").forEach((card) => {
    card.addEventListener("click", () => go("role/" + card.dataset.slug));
  });
}

// ---------- render: skill grid ----------
function renderSkillGrid(filter) {
  const grid = document.getElementById("skill-grid");
  const q = (filter || "").trim().toLowerCase();
  const items = SKILLS.filter((s) => !q || s.name.toLowerCase().includes(q));

  if (items.length === 0) {
    grid.innerHTML = `<div class="empty">No skill areas match “${esc(filter)}”.</div>`;
    return;
  }

  grid.innerHTML = items
    .map((s) => `
      <div class="skill-card" data-id="${s.id.toLowerCase()}">
        <div class="skill-id">${s.id}</div>
        <h3>${esc(s.name)}</h3>
        <p class="muted" style="font-size:15.5px;line-height:1.6;margin:0 0 12px;">${esc(s.description || "")}</p>
        <div class="mini-levels">
          <span class="level l1">L1</span>
          <span class="level l2">L2</span>
          <span class="level l3">L3</span>
          <span class="level l4">L4</span>
        </div>
      </div>`)
    .join("");

  grid.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("click", () => go("skill/" + card.dataset.id));
  });
}

// ---------- render: role detail ----------
function renderRoleDetail(slug) {
  const role = findRole(slug);
  if (!role) return go("roles");

  document.getElementById("role-detail-title").textContent = role.name;
  document.getElementById("role-detail-title").style.color = role.color || "";
  document.getElementById("role-detail-summary").textContent = role.mission || role.summary || "";
  const iconEl = document.getElementById("role-detail-icon");
  if (role.icon) {
    iconEl.src = "assets/icons/" + role.icon + ".svg";
    iconEl.style.display = "block";
  } else {
    iconEl.style.display = "none";
  }

  document.getElementById("role-detail-tasks").innerHTML = role.tasks
    .map((t) => `
      <li class="task">
        <span class="task-num">${esc(t.id)}</span>
        <span>${esc(t.text)}</span>
      </li>`)
    .join("");

  document.getElementById("role-detail-skills").innerHTML = role.skills
    .map((s) => `
      <div class="skill-map-row">
        <a href="#/skill/${s.id.toLowerCase()}">${esc(s.name)}</a>
        <span class="level ${levelClass(s.level)}">${esc(s.level)}</span>
      </div>`)
    .join("");

  document.querySelectorAll("#role-detail-skills a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      go(a.getAttribute("href").replace(/^#\//, ""));
    });
  });
}

// ---------- render: skill detail ----------
const LEVEL_ORDER = ["L1", "L2", "L3", "L4"];

function renderSkillDetail(id) {
  const skill = findSkill(id);
  if (!skill) return go("skills");

  document.getElementById("skill-detail-title").textContent = skill.name;
  document.getElementById("skill-detail-desc").textContent = skill.description || "";
  document.getElementById("skill-detail-eyebrow").textContent = skill.id + " · Skill area";

  document.getElementById("skill-detail-levels").innerHTML = LEVEL_ORDER
    .map((lvl) => {
      const info = skill.levels[lvl];
      if (!info) return "";
      return `
        <div class="level-row">
          <span class="level ${levelClass(lvl)}">${lvl}</span>
          <div>
            <h3>${esc(info.name)}</h3>
            <p>${esc(info.description)}</p>
          </div>
        </div>`;
    })
    .join("");

  const rolesWithSkill = ROLES
    .map((r) => ({ role: r, ref: r.skills.find((s) => s.id === skill.id) }))
    .filter((x) => x.ref);

  const rolesEl = document.getElementById("skill-detail-roles");
  if (rolesWithSkill.length === 0) {
    rolesEl.innerHTML = `<p class="muted">No ECSF profiles reference this skill area yet.</p>`;
  } else {
    rolesEl.innerHTML = rolesWithSkill
      .map(
        (x) =>
          `<a class="tag" href="#/role/${roleSlug(x.role)}">${esc(x.role.name)} · ${esc(x.ref.level)}</a>`
      )
      .join("");
    rolesEl.querySelectorAll("a.tag").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        go(a.getAttribute("href").replace(/^#\//, ""));
      });
    });
  }
}

// ---------- render: skills matrix ----------
function renderMatrix() {
  const wrap = document.getElementById("matrix-wrap");

  let html = '<table class="matrix-table"><thead><tr><th class="matrix-corner"></th>';
  ROLES.forEach((r) => {
    html += `<th><a href="#/role/${roleSlug(r)}" title="${esc(r.name)}">${esc(ROLE_CODE[r.name] || r.name.slice(0, 3).toUpperCase())}</a></th>`;
  });
  html += "</tr></thead><tbody>";

  SKILLS.forEach((s) => {
    html += `<tr><td class="matrix-rowlabel"><a href="#/skill/${s.id.toLowerCase()}" title="${esc(s.name)}"><span class="matrix-sid">${s.id}</span>${esc(s.name)}</a></td>`;
    ROLES.forEach((r) => {
      const ref = r.skills.find((x) => x.id === s.id);
      if (ref) {
        html += `<td class="matrix-cell ${levelClass(ref.level)}" title="${esc(r.name)} — ${esc(s.name)}: ${esc(ref.level)}">${esc(ref.level.replace("L", ""))}</td>`;
      } else {
        html += '<td class="matrix-cell matrix-empty"></td>';
      }
    });
    html += "</tr>";
  });
  html += "</tbody></table>";
  wrap.innerHTML = html;

  wrap.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      go(a.getAttribute("href").replace(/^#\//, ""));
    });
  });
}

// ---------- view switching ----------
const VIEW_IDS = {
  home: "view-home",
  roles: "view-roles",
  "role-detail": "view-role-detail",
  skills: "view-skills",
  "skill-detail": "view-skill-detail",
  matrix: "view-matrix",
};

function showView(key) {
  Object.values(VIEW_IDS).forEach((id) => document.getElementById(id).classList.remove("active"));
  document.getElementById(VIEW_IDS[key]).classList.add("active");

  const navKey = key === "role-detail" ? "roles" : key === "skill-detail" ? "skills" : key;
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === navKey);
  });
}

function go(path) {
  location.hash = "/" + path;
}

function router() {
  const hash = location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);

  if (parts.length === 0) {
    showView("home");
    return;
  }
  if (parts[0] === "roles") {
    renderRoleGrid(document.getElementById("role-search").value);
    showView("roles");
    return;
  }
  if (parts[0] === "role" && parts[1]) {
    renderRoleDetail(parts[1]);
    showView("role-detail");
    return;
  }
  if (parts[0] === "skills") {
    renderSkillGrid(document.getElementById("skill-search").value);
    showView("skills");
    return;
  }
  if (parts[0] === "skill" && parts[1]) {
    renderSkillDetail(parts[1]);
    showView("skill-detail");
    return;
  }
  if (parts[0] === "matrix") {
    renderMatrix();
    showView("matrix");
    return;
  }
  showView("home");
}

// ---------- wire up static controls ----------
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => go(btn.dataset.view === "home" ? "" : btn.dataset.view));
});
document.querySelectorAll("[data-nav]").forEach((btn) => {
  btn.addEventListener("click", () => go(btn.dataset.nav));
});
document.getElementById("role-search").addEventListener("input", (e) => renderRoleGrid(e.target.value));
document.getElementById("skill-search").addEventListener("input", (e) => renderSkillGrid(e.target.value));

window.addEventListener("hashchange", () => {
  window.scrollTo(0, 0);
  router();
});
window.addEventListener("DOMContentLoaded", () => {
  renderRoleGrid("");
  renderSkillGrid("");
  router();
});
