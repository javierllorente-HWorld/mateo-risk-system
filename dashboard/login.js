/**
 * Acceso interno demo. Las cuentas reales las gestiona la empresa.
 * Sustituir por backend / SSO cuando exista servicio de auth.
 */
const INTERNAL_ACCOUNTS = [
  { email: "analista@empresa.com", password: "Riesgo2026" },
  { email: "riesgo@empresa.com", password: "Panel2026" }
];

const AUTH_KEY = "dashboard_auth";

function normalizeEmail(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function findAccount(email, password) {
  const e = normalizeEmail(email);
  return INTERNAL_ACCOUNTS.find((a) => normalizeEmail(a.email) === e && a.password === password);
}

function init() {
  try {
    if (sessionStorage.getItem(AUTH_KEY)) {
      window.location.replace("./index.html");
      return;
    }
  } catch {
    /* sessionStorage no disponible */
  }

  const form = document.getElementById("loginForm");
  const err = document.getElementById("loginError");

  form?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (err) {
      err.hidden = true;
      err.textContent = "";
    }

    const fd = new FormData(form);
    const email = fd.get("email");
    const password = fd.get("password");

    if (!findAccount(email, password)) {
      if (err) {
        err.textContent = "Correo o contraseña incorrectos.";
        err.hidden = false;
      }
      return;
    }

    try {
      sessionStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ email: normalizeEmail(email), ts: Date.now() })
      );
    } catch {
      if (err) {
        err.textContent = "No se pudo guardar la sesión en este navegador.";
        err.hidden = false;
      }
      return;
    }

    window.location.replace("./index.html");
  });
}

init();
