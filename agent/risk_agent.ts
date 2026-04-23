import type { CreditApplication, Decision, RiskAssessment } from "./risk_schema.ts";
import { riskRules } from "./risk_rules.ts";

function decisionFromScore(score: number): Decision {
  if (score >= 70) return "reject";
  if (score >= 30) return "review";
  return "approve";
}

function summaryFrom(decision: Decision, score: number, reasons: string[]): string {
  const topReasons = reasons.slice(0, 2).join(" ");
  if (!topReasons) return `${decision.toUpperCase()} (score=${score}).`;
  return `${decision.toUpperCase()} (score=${score}): ${topReasons}`;
}

export function analyzeApplicantRisk(app: CreditApplication): RiskAssessment {
  const hits = riskRules.map((r) => r(app)).filter(Boolean) as NonNullable<
    ReturnType<(typeof riskRules)[number]>
  >[];

  const score = hits.reduce((sum, h) => sum + h.scoreDelta, 0);
  const decision = decisionFromScore(score);

  const flags = hits.map((h) => h.flag);
  const reasons = hits.map((h) => h.reason);
  const summary = summaryFrom(decision, score, reasons);

  return { score, decision, summary, flags, reasons };
}
