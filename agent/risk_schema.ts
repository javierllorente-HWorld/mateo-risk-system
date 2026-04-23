export type Decision = "approve" | "review" | "reject";

export type CreditApplication = {
  id: string;
  requestedAmount: number;
  currency: string;
  country: string;
  applicantAgeYears: number;
  employmentStatus: "employed" | "self_employed" | "unemployed" | "student";
  monthlyIncome: number;
  monthsAtJob: number;
  hasDefaults: boolean;
};

export type RuleHit = {
  /** Small identifier used as a flag */
  flag: string;
  /** Human readable reason */
  reason: string;
  /** Adds to total risk score (>= 0) */
  scoreDelta: number;
};

export type RiskAssessment = {
  score: number;
  decision: Decision;
  summary: string;
  flags: string[];
  reasons: string[];
};
