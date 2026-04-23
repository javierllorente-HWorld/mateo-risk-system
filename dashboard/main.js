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

function normalizeSummaryEs(summary, decision, score) {
  if (!summary) return "—";
  let s = String(summary);
  s = s.replace(/\bAPPROVE\b/g, "APROBADO");
  s = s.replace(/\bREVIEW\b/g, "REVISIÓN");
  s = s.replace(/\bREJECT\b/g, "RECHAZADO");
  s = s.replace(/score=/gi, "puntaje=");

  // If the agent didn't include decision/score in the text, add a clear prefix.
  const d = toDecisionLabelEs(decision);
  const prefix = `Decisión: ${d}${typeof score === "number" ? ` • Puntaje: ${score}` : ""}. `;
  if (!/^decisión:/i.test(s)) return prefix + s;
  return s;
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

async function load() {
  const res = await fetch("./data.json", { cache: "no-store" });
  const data = await res.json();

  setText("applicantName", data?.applicantName);
  const score = typeof data?.assessment?.score === "number" ? data.assessment.score : Number(data?.assessment?.score);
  const decision = data?.assessment?.decision;

  setText("score", Number.isFinite(score) ? String(score) : "—");
  setText("scoreContext", toRiskBandEs(Number.isFinite(score) ? score : undefined, decision));
  setText("decisionText", toDecisionLabelEs(decision));
  setText("summary", normalizeSummaryEs(data?.assessment?.summary, decision, Number.isFinite(score) ? score : undefined));
  setDecisionPill(data?.assessment?.decision);

  setList("reasons", data?.assessment?.reasons);
  setList("flags", data?.assessment?.flags, flagToLabelEs);

  // Optional applicant context (only shown if present in data.json)
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

load().catch((e) => {
  console.error("Failed to load dashboard data:", e);
  setText("summary", "Error cargando data.json");
});

