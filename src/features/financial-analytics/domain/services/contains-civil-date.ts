import type { FinancialPeriod } from "../types/financial-period.types";
import { CivilDate } from "../value-objects/civil-date";

export function containsCivilDate(
  period: FinancialPeriod,
  candidateOn: string
): boolean {
  let canonicalCandidate: string;

  try {
    canonicalCandidate = CivilDate.fromString(candidateOn).value;
  } catch {
    throw new Error("candidateOn is invalid");
  }

  return (
    canonicalCandidate >= period.startOnInclusive &&
    canonicalCandidate < period.endOnExclusive
  );
}
