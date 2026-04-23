import { analyzeApplicantRisk } from "./risk_agent.ts";
import type { CreditApplication } from "./risk_schema.ts";

const cases: { name: string; app: CreditApplication }[] = [
  {
    name: "approve",
    app: {
      id: "app_approve",
      requestedAmount: 50000,
      currency: "ARS",
      country: "AR",
      applicantAgeYears: 30,
      employmentStatus: "employed",
      monthlyIncome: 500000,
      monthsAtJob: 24,
      hasDefaults: false,
    },
  },
  {
    name: "review",
    app: {
      id: "app_review",
      requestedAmount: 600000,
      currency: "ARS",
      country: "AR",
      applicantAgeYears: 35,
      employmentStatus: "employed",
      monthlyIncome: 200000,
      monthsAtJob: 2,
      hasDefaults: false,
    },
  },
  {
    name: "reject",
    app: {
      id: "app_reject",
      requestedAmount: 600000,
      currency: "ARS",
      country: "US",
      applicantAgeYears: 28,
      employmentStatus: "unemployed",
      monthlyIncome: 100000,
      monthsAtJob: 0,
      hasDefaults: true,
    },
  },
];

for (const c of cases) {
  const result = analyzeApplicantRisk(c.app);
  console.log(`\n=== ${c.name} (${c.app.id}) ===`);
  console.log(result);
}
