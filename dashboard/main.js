function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text ?? "—";
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
    country_risk: "Riesgo país elevado",
    high_leverage: "Apalancamiento elevado",
    customer_concentration: "Concentración de clientes",
    thin_margins: "Márgenes ajustados",
    sector_risk: "Sector con volatilidad alta"
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

function formatMoney(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  // Always show "$" as requested; keep it simple and readable.
  return `$${n.toLocaleString("es-AR")}`;
}

function setOptionalMoneyField(id, value) {
  const formatted = formatMoney(value);
  // If it's not a number, fall back to default display behavior.
  if (formatted === null) return setOptionalField(id, value);
  return setOptionalField(id, formatted);
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
  else url.searchParams.delete("user");
  url.searchParams.delete("company");
  window.history.replaceState({}, "", url.toString());
}

function getSelectedCompanyId() {
  const url = new URL(window.location.href);
  const fromUrl = url.searchParams.get("company");
  if (fromUrl) return fromUrl;
  try {
    return window.localStorage.getItem("selected_company") || null;
  } catch {
    return null;
  }
}

function setSelectedCompanyId(id) {
  try {
    if (id) window.localStorage.setItem("selected_company", id);
  } catch {}
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("company", id);
  else url.searchParams.delete("company");
  url.searchParams.delete("user");
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

async function loadCompaniesIndex() {
  try {
    const res = await fetch("./companies.json", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !Array.isArray(data.companies)) return null;
    return data.companies;
  } catch {
    return null;
  }
}

async function loadAssessmentJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${path}`);
  return await res.json();
}

const MODE_COPY = {
  persona: {
    detailsTitle: "Datos del solicitante",
    applicantLabel: "Solicitante",
    income: "Ingreso mensual",
    amount: "Monto solicitado",
    employment: "Empleo",
    tenure: "Antigüedad laboral"
  },
  pyme: {
    detailsTitle: "Datos de la empresa",
    applicantLabel: "Empresa",
    income: "Facturación mensual",
    amount: "Monto solicitado",
    employment: "Actividad",
    tenure: "Antigüedad de la empresa"
  }
};

function getAnalysisModeFromStorage() {
  try {
    const v = window.localStorage.getItem("dashboard_analysis_mode");
    if (v === "pyme" || v === "persona") return v;
  } catch {}
  return "persona";
}

function persistAnalysisMode(mode) {
  try {
    window.localStorage.setItem("dashboard_analysis_mode", mode);
  } catch {}
}

function syncAnalysisRadiosFromStorage() {
  const mode = getAnalysisModeFromStorage();
  const persona = document.getElementById("analysisPersona");
  const pyme = document.getElementById("analysisPyme");
  if (!persona || !pyme) return;
  if (mode === "pyme") {
    pyme.checked = true;
    persona.checked = false;
  } else {
    persona.checked = true;
    pyme.checked = false;
  }
}

function getCurrentAnalysisMode() {
  const el = document.querySelector('input[name="analysisType"]:checked');
  return el?.value === "pyme" ? "pyme" : "persona";
}

function applyModeLabels(mode) {
  const m = mode === "pyme" ? "pyme" : "persona";
  const c = MODE_COPY[m];
  setText("applicantDetailsTitle", c.detailsTitle);
  setText("applicantMetaLabel", c.applicantLabel);
  setText("labelMonthlyIncome", c.income);
  setText("labelRequestedAmount", c.amount);
  setText("labelEmployment", c.employment);
  setText("labelJobTenure", c.tenure);
}

function buildViewRow(raw, analysisMode) {
  const base = raw && typeof raw === "object" ? raw : {};
  if (analysisMode === "persona") {
    const { pyme: _omit, ...rest } = base;
    return rest;
  }
  if (base.pyme && typeof base.pyme === "object") {
    const p = base.pyme;
    return {
      ...base,
      applicantName: p.applicantName ?? base.applicantName,
      monthlyIncome: p.monthlyIncome ?? base.monthlyIncome,
      requestedAmount: p.requestedAmount ?? base.requestedAmount,
      employmentStatus: p.employmentStatus ?? base.employmentStatus,
      monthsAtJob: p.monthsAtJob ?? base.monthsAtJob,
      applicantAgeYears: Object.prototype.hasOwnProperty.call(p, "applicantAgeYears") ? p.applicantAgeYears : undefined,
      country: p.country ?? base.country,
      currency: p.currency ?? base.currency,
      assessment: p.assessment ?? base.assessment
    };
  }
  return { ...base };
}

function getEntityListMeta(raw, analysisMode) {
  const data = buildViewRow(raw, analysisMode);
  const score = typeof data?.assessment?.score === "number" ? data.assessment.score : Number(data?.assessment?.score);
  const decision = data?.assessment?.decision;
  const riskLevel = toRiskLevel(Number.isFinite(score) ? score : undefined, decision);
  const riskLabel = toRiskBandEs(Number.isFinite(score) ? score : undefined, decision);
  return {
    scoreLabel: Number.isFinite(score) ? String(score) : "—",
    riskLevel,
    riskLabel: riskLabel && riskLabel !== "—" ? riskLabel : "—"
  };
}

function renderMasterList(entities, selectedId, onSelect, metaById) {
  const container = document.getElementById("masterList");
  if (!container) return;
  container.innerHTML = "";

  if (!entities || entities.length === 0) {
    const empty = document.createElement("div");
    empty.className = "masterEmpty muted";
    empty.textContent = "No hay resultados.";
    container.appendChild(empty);
    return;
  }

  for (const entity of entities) {
    const id = entity?.id ?? "";
    const meta = metaById?.get(id) ?? { scoreLabel: "—", riskLevel: null, riskLabel: "—" };
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "masterCard";
    btn.setAttribute("role", "option");
    const isActive = id === selectedId;
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
    if (isActive) btn.classList.add("is-active");

    const top = document.createElement("div");
    top.className = "masterCardTop";
    const nameEl = document.createElement("span");
    nameEl.className = "masterCardName";
    nameEl.textContent = entity?.label ?? id ?? "—";
    const scoreEl = document.createElement("span");
    scoreEl.className = "masterCardScore";
    scoreEl.textContent = meta.scoreLabel;
    top.appendChild(nameEl);
    top.appendChild(scoreEl);
    btn.appendChild(top);

    const pill = document.createElement("span");
    pill.className = "masterCardPill";
    pill.textContent = meta.riskLabel;
    if (meta.riskLevel === "low" || meta.riskLevel === "medium" || meta.riskLevel === "high") {
      pill.classList.add(meta.riskLevel);
    } else {
      pill.classList.add("neutral");
    }
    btn.appendChild(pill);

    btn.addEventListener("click", () => onSelect(entity));
    container.appendChild(btn);
  }
}

function applyDashboardData(raw, analysisMode) {
  const mode = analysisMode === "pyme" ? "pyme" : "persona";
  applyModeLabels(mode);
  const data = buildViewRow(raw, mode);

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
  setOptionalMoneyField("monthlyIncome", data?.monthlyIncome);
  setOptionalMoneyField("requestedAmount", data?.requestedAmount);
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

function syncMasterPanelChrome(mode) {
  const search = document.getElementById("masterSearch");
  const list = document.getElementById("masterList");
  if (mode === "pyme") {
    if (search) {
      search.placeholder = "Buscar...";
      search.setAttribute("aria-label", "Buscar empresa");
    }
    if (list) list.setAttribute("aria-label", "Lista de empresas");
  } else {
    if (search) {
      search.placeholder = "Buscar...";
      search.setAttribute("aria-label", "Buscar solicitante");
    }
    if (list) list.setAttribute("aria-label", "Lista de solicitantes");
  }
}

async function load() {
  syncAnalysisRadiosFromStorage();

  const masterSearch = document.getElementById("masterSearch");

  const users = (await loadUsersIndex()) ?? [
    { id: "default", label: "Grace Hopper", subtitle: "Ejemplo", dataPath: "./data.json" }
  ];

  const companies = (await loadCompaniesIndex()) ?? [
    { id: "hopper-labs", label: "Hopper Labs SRL", subtitle: "Ejemplo", dataPath: "./company_hopper_labs.json" }
  ];

  let selectedPersona = users.find((u) => u?.id === getSelectedUserId()) ?? users[0];
  let selectedPyme = companies.find((c) => c?.id === getSelectedCompanyId()) ?? companies[0];

  const url = new URL(window.location.href);
  if (getCurrentAnalysisMode() === "persona") url.searchParams.delete("company");
  else url.searchParams.delete("user");
  window.history.replaceState({}, "", url.toString());

  const personaMetaById = new Map();
  for (const u of users) {
    const uid = u?.id ?? "";
    try {
      const raw = await loadAssessmentJson(u?.dataPath ?? "./data.json");
      personaMetaById.set(uid, getEntityListMeta(raw, "persona"));
    } catch {
      personaMetaById.set(uid, { scoreLabel: "—", riskLevel: null, riskLabel: "—" });
    }
  }

  const pymeMetaById = new Map();
  for (const c of companies) {
    const cid = c?.id ?? "";
    try {
      const raw = await loadAssessmentJson(c?.dataPath ?? "./company_hopper_labs.json");
      pymeMetaById.set(cid, getEntityListMeta(raw, "pyme"));
    } catch {
      pymeMetaById.set(cid, { scoreLabel: "—", riskLevel: null, riskLabel: "—" });
    }
  }

  let personaRaw;
  let pymeRaw;

  function renderFiltered() {
    const mode = getCurrentAnalysisMode();
    const list = mode === "pyme" ? companies : users;
    const selectedId = mode === "pyme" ? selectedPyme?.id : selectedPersona?.id;
    const onSelect = mode === "pyme" ? onSelectPyme : onSelectPersona;
    const metaMap = mode === "pyme" ? pymeMetaById : personaMetaById;
    const q = (masterSearch?.value ?? "").trim().toLowerCase();
    const filtered = q
      ? list.filter((item) => String(item?.label ?? item?.id ?? "").toLowerCase().includes(q))
      : list;
    renderMasterList(filtered, selectedId, onSelect, metaMap);
  }

  async function loadPersonaPayload(u) {
    selectedPersona = u;
    const path = u?.dataPath ?? "./data.json";
    personaRaw = await loadAssessmentJson(path);
    if (getCurrentAnalysisMode() === "persona") {
      applyDashboardData(personaRaw, "persona");
    }
    renderFiltered();
  }

  async function loadPymePayload(c) {
    selectedPyme = c;
    const path = c?.dataPath ?? "./company_hopper_labs.json";
    pymeRaw = await loadAssessmentJson(path);
    if (getCurrentAnalysisMode() === "pyme") {
      applyDashboardData(pymeRaw, "pyme");
    }
    renderFiltered();
  }

  async function onSelectPersona(u) {
    setSelectedUserId(u?.id);
    await loadPersonaPayload(u);
  }

  async function onSelectPyme(c) {
    setSelectedCompanyId(c?.id);
    await loadPymePayload(c);
  }

  const onAnalysisModeChange = async () => {
    const mode = getCurrentAnalysisMode();
    persistAnalysisMode(mode);
    syncMasterPanelChrome(mode);
    if (masterSearch) masterSearch.value = "";
    if (mode === "persona") {
      if (personaRaw === undefined) await loadPersonaPayload(selectedPersona);
      else applyDashboardData(personaRaw, "persona");
    } else {
      if (pymeRaw === undefined) await loadPymePayload(selectedPyme);
      else applyDashboardData(pymeRaw, "pyme");
    }
    renderFiltered();
  };

  for (const id of ["analysisPyme", "analysisPersona"]) {
    document.getElementById(id)?.addEventListener("change", onAnalysisModeChange);
  }

  syncMasterPanelChrome(getCurrentAnalysisMode());

  if (masterSearch) {
    masterSearch.addEventListener("input", renderFiltered);
  }

  if (getCurrentAnalysisMode() === "persona") {
    await loadPersonaPayload(selectedPersona);
  } else {
    await loadPymePayload(selectedPyme);
  }
}

load().catch((e) => {
  console.error("Failed to load dashboard data:", e);
  setText("summary", "Error cargando data.json");
});

