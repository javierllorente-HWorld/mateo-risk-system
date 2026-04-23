function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text ?? "—";
}

function setExpanded(el, expanded) {
  if (!el) return;
  el.setAttribute("aria-expanded", expanded ? "true" : "false");
}

function setList(id, items, mapItem) {
  const ul = document.getElementById(id);
  if (!ul) return;
  ul.innerHTML = "";

  if (!items || items.length === 0) {
    const li = document.createElement("li");
    li.textContent = "—";
    ul.appendChild(li);
    return;
  }

  for (const raw of items) {
    const li = document.createElement("li");
    li.textContent = mapItem ? mapItem(raw) : raw;
    ul.appendChild(li);
  }
}

function setDecisionPill(decision) {
  const pill = document.getElementById("decisionPill");
  if (!pill) return;
  pill.className = "pill";
  const label = toDecisionLabelEs(decision);
  pill.textContent = (label ?? "—").toString().toUpperCase();
  if (decision === "approve" || decision === "review" || decision === "reject") {
    pill.classList.add(decision);
  }
}

function toDecisionLabelEs(decision) {
  if (decision === "approve") return "Aprobado";
  if (decision === "review") return "Revisión";
  if (decision === "reject") return "Rechazado";
  return decision ?? "—";
}

function toRiskBandEs(score, decision) {
  if (decision === "approve") return "Riesgo bajo";
  if (decision === "review") return "Riesgo medio";
  if (decision === "reject") return "Riesgo alto";
  if (typeof score !== "number" || Number.isNaN(score)) return "—";
  if (score <= 35) return "Riesgo bajo";
  if (score <= 70) return "Riesgo medio";
  return "Riesgo alto";
}

function toRiskLevel(score, decision) {
  if (decision === "approve") return "low";
  if (decision === "review") return "medium";
  if (decision === "reject") return "high";
  if (typeof score !== "number" || Number.isNaN(score)) return null;
  if (score <= 35) return "low";
  if (score <= 70) return "medium";
  return "high";
}

function normalizeSummaryEs(summary, decision, score) {
  if (!summary) return "—";
  let s = String(summary);
  s = s.replace(/\bAPPROVE\b/g, "APROBADO");
  s = s.replace(/\bREVIEW\b/g, "REVISIÓN");
  s = s.replace(/\bREJECT\b/g, "RECHAZADO");
  s = s.replace(/score=/gi, "puntaje=");

  // Remove common technical prefixes like: "REVISIÓN (puntaje=55): ..."
  s = s.replace(/^(APROBADO|REVISIÓN|RECHAZADO)\s*\([^)]*\)\s*:\s*/i, "");
  s = s.replace(/^(APROBADO|REVISIÓN|RECHAZADO)\s*:\s*/i, "");

  // If it's still very short/empty, fallback to a clear statement.
  const cleaned = s.trim();
  if (!cleaned) return "—";
  return cleaned;
}

function flagToLabelEs(flag) {
  const key = String(flag ?? "");
  const map = {
    requested_amount_high: "Monto solicitado alto",
    short_job_tenure: "Poca antigüedad laboral",
    has_defaults: "Registra incumplimientos",
    low_income: "Ingresos bajos",
    high_dti: "Relación deuda/ingreso alta",
    underage: "Edad insuficiente",
    country_risk: "Riesgo país elevado"
  };
  if (map[key]) return map[key];
  if (!key) return "—";
  // Fallback: snake_case → words, capitalize first letter.
  const pretty = key.replace(/_/g, " ").trim();
  return pretty ? pretty.charAt(0).toUpperCase() + pretty.slice(1) : "—";
}

function setOptionalField(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const wrapper = el.closest("[data-field]");
  const isEmpty = value === undefined || value === null || value === "";
  if (wrapper) wrapper.style.display = isEmpty ? "none" : "";
  if (!isEmpty) el.textContent = String(value);
}

function getSelectedUserId() {
  const url = new URL(window.location.href);
  const fromUrl = url.searchParams.get("user");
  if (fromUrl) return fromUrl;
  try {
    const fromStorage = window.localStorage.getItem("selected_user");
    return fromStorage || null;
  } catch {
    return null;
  }
}

function setSelectedUserId(id) {
  try {
    if (id) window.localStorage.setItem("selected_user", id);
  } catch {}
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("user", id);
  window.history.replaceState({}, "", url.toString());
}

async function loadUsersIndex() {
  // Optional. If it doesn't exist, we fallback to a single default user (data.json).
  try {
    const res = await fetch("./users.json", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !Array.isArray(data.users)) return null;
    return data.users;
  } catch {
    return null;
  }
}

function openMenu(menu, trigger) {
  if (!menu || !trigger) return;
  menu.classList.add("open");
  setExpanded(trigger, true);
}

function closeMenu(menu, trigger) {
  if (!menu || !trigger) return;
  menu.classList.remove("open");
  setExpanded(trigger, false);
}

function isMenuOpen(menu) {
  return !!menu && menu.classList.contains("open");
}

function renderUserMenu(users, onSelect) {
  const menu = document.getElementById("applicantMenu");
  if (!menu) return;
  menu.innerHTML = "";

  for (const u of users) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "menuItem";
    btn.setAttribute("role", "option");
    btn.textContent = u?.label ?? u?.id ?? "Usuario";

    const sub = u?.subtitle ? document.createElement("span") : null;
    if (sub) {
      sub.className = "sub";
      sub.textContent = u.subtitle;
      btn.appendChild(sub);
    }

    btn.addEventListener("click", () => onSelect(u));
    menu.appendChild(btn);
  }
}

async function loadAssessmentJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${path}`);
  return await res.json();
}

function applyDashboardData(data) {
  setText("applicantName", data?.applicantName);
  const score = typeof data?.assessment?.score === "number" ? data.assessment.score : Number(data?.assessment?.score);
  const decision = data?.assessment?.decision;
  const riskLevel = toRiskLevel(Number.isFinite(score) ? score : undefined, decision);
  const riskBand = toRiskBandEs(Number.isFinite(score) ? score : undefined, decision);

  setText("score", Number.isFinite(score) ? String(score) : "—");
  setText("scoreContext", riskBand);
  setText("generalStatus", riskBand);

  const scoreCtx = document.getElementById("scoreContext");
  if (scoreCtx) scoreCtx.className = `scoreContext${riskLevel ? ` ${riskLevel}` : ""}`;

  const status = document.getElementById("generalStatus");
  if (status) status.className = `statusChip${riskLevel ? ` ${riskLevel}` : ""}`;

  const decisionEl = document.getElementById("decisionText");
  if (decisionEl) decisionEl.className = `decisionText${decision ? ` ${decision}` : ""}`;

  setText("decisionText", toDecisionLabelEs(decision));
  setText("summary", normalizeSummaryEs(data?.assessment?.summary, decision, Number.isFinite(score) ? score : undefined));
  setDecisionPill(data?.assessment?.decision);

  setList("reasons", data?.assessment?.reasons);
  setList("flags", data?.assessment?.flags, flagToLabelEs);

  // Optional applicant context (only shown if present in selected user JSON)
  setOptionalField("applicantAgeYears", data?.applicantAgeYears);
  setOptionalField("monthlyIncome", data?.monthlyIncome);
  setOptionalField("requestedAmount", data?.requestedAmount);
  setOptionalField("employmentStatus", data?.employmentStatus);
  setOptionalField("monthsAtJob", data?.monthsAtJob);
  const cc =
    data?.country && data?.currency ? `${data.country} • ${data.currency}` : data?.country || data?.currency;
  setOptionalField("countryCurrency", cc);

  const details = document.getElementById("applicantDetails");
  if (details) {
    const fields = details.querySelectorAll("[data-field]");
    const anyVisible = Array.from(fields).some((n) => n.style.display !== "none");
    details.style.display = anyVisible ? "" : "none";
  }
}

async function load() {
  const trigger = document.getElementById("applicantTrigger");
  const menu = document.getElementById("applicantMenu");

  const users = (await loadUsersIndex()) ?? [
    { id: "default", label: "Ada Lovelace", subtitle: "Ejemplo", dataPath: "./data.json" }
  ];

  const selectedId = getSelectedUserId() ?? users[0]?.id ?? "default";
  let selected = users.find((u) => u?.id === selectedId) ?? users[0];

  const loadAndRender = async (u) => {
    const path = u?.dataPath ?? "./data.json";
    const data = await loadAssessmentJson(path);
    applyDashboardData(data);
  };

  renderUserMenu(users, async (u) => {
    selected = u;
    setSelectedUserId(u?.id);
    closeMenu(menu, trigger);
    await loadAndRender(u);
  });

  if (trigger && menu) {
    setExpanded(trigger, false);
    trigger.addEventListener("click", () => {
      if (isMenuOpen(menu)) closeMenu(menu, trigger);
      else openMenu(menu, trigger);
    });

    document.addEventListener("click", (e) => {
      const dd = document.getElementById("applicantDropdown");
      if (!dd) return;
      if (!dd.contains(e.target)) closeMenu(menu, trigger);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu(menu, trigger);
    });
  }

  // Initial render
  await loadAndRender(selected);
}

load().catch((e) => {
  console.error("Failed to load dashboard data:", e);
  setText("summary", "Error cargando data.json");
});

