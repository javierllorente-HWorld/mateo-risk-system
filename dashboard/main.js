function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text ?? "—";
}

function setFlags(flags) {
  const ul = document.getElementById("flags");
  if (!ul) return;
  ul.innerHTML = "";

  if (!flags || flags.length === 0) {
    const li = document.createElement("li");
    li.textContent = "—";
    ul.appendChild(li);
    return;
  }

  for (const f of flags) {
    const li = document.createElement("li");
    li.textContent = f;
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
  if (decision === "approve") return "Aprobar";
  if (decision === "review") return "Revisar";
  if (decision === "reject") return "Rechazar";
  return decision ?? "—";
}

async function load() {
  const res = await fetch("./data.json", { cache: "no-store" });
  const data = await res.json();

  setText("applicantName", data?.applicantName);
  setText("score", String(data?.assessment?.score ?? "—"));
  setText("decision", toDecisionLabelEs(data?.assessment?.decision));
  setText("summary", data?.assessment?.summary);
  setDecisionPill(data?.assessment?.decision);
  setFlags(data?.assessment?.flags);
}

load().catch((e) => {
  console.error("Failed to load dashboard data:", e);
  setText("summary", "Error cargando data.json");
});

