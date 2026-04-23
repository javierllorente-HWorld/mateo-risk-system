import type { CreditApplication, RuleHit } from "./risk_schema.ts";

export type RiskRule = (app: CreditApplication) => RuleHit | null;

export const riskRules: RiskRule[] = [
  (app) =>
    app.requestedAmount > 500000
      ? {
          flag: "requested_amount_high",
          reason: "Monto solicitado alto.",
          scoreDelta: 40,
        }
      : null,

  (app) =>
    app.hasDefaults
      ? {
          flag: "has_defaults",
          reason: "Historial de incumplimientos (defaults).",
          scoreDelta: 60,
        }
      : null,

  (app) =>
    app.employmentStatus === "unemployed"
      ? {
          flag: "unemployed",
          reason: "Sin empleo declarado.",
          scoreDelta: 20,
        }
      : null,

  (app) =>
    app.monthlyIncome > 0 && app.requestedAmount / app.monthlyIncome >= 10
      ? {
          flag: "high_dti_proxy",
          reason: "Monto solicitado alto respecto al ingreso mensual.",
          scoreDelta: 30,
        }
      : null,

  (app) =>
    app.monthsAtJob >= 0 && app.monthsAtJob < 3
      ? {
          flag: "short_job_tenure",
          reason: "Poca antigüedad laboral.",
          scoreDelta: 15,
        }
      : null,

  (app) =>
    app.country.toUpperCase() !== "AR"
      ? {
          flag: "foreign_country",
          reason: "País fuera del principal mercado.",
          scoreDelta: 10,
        }
      : null,
];
