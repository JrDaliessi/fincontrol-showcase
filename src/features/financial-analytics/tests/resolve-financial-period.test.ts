import { describe, expect, it } from "@jest/globals";
import { containsCivilDate } from "../domain/services/contains-civil-date";
import { resolveFinancialPeriod } from "../domain/services/resolve-financial-period";
import type { FinancialPeriodKind } from "../domain/types/financial-period.types";

type PeriodCase = {
  kind: FinancialPeriodKind;
  referenceOn: string;
  startOnInclusive: string;
  endOnExclusive: string;
};

const periodCases: readonly PeriodCase[] = [
  {
    kind: "week",
    referenceOn: "2026-08-19",
    startOnInclusive: "2026-08-17",
    endOnExclusive: "2026-08-24"
  },
  {
    kind: "rolling_7_days",
    referenceOn: "2024-03-01",
    startOnInclusive: "2024-02-24",
    endOnExclusive: "2024-03-02"
  },
  {
    kind: "fortnight",
    referenceOn: "2026-02-16",
    startOnInclusive: "2026-02-16",
    endOnExclusive: "2026-03-01"
  },
  {
    kind: "rolling_15_days",
    referenceOn: "2026-01-05",
    startOnInclusive: "2025-12-22",
    endOnExclusive: "2026-01-06"
  },
  {
    kind: "month",
    referenceOn: "2026-12-31",
    startOnInclusive: "2026-12-01",
    endOnExclusive: "2027-01-01"
  }
];

describe("resolveFinancialPeriod", () => {
  it.each(periodCases)("resolves $kind from $referenceOn", (periodCase) => {
    expect(
      resolveFinancialPeriod({
        kind: periodCase.kind,
        referenceOn: periodCase.referenceOn
      })
    ).toEqual(periodCase);
  });

  it("rejects invalid dates", () => {
    expect(() =>
      resolveFinancialPeriod({ kind: "month", referenceOn: "2026-02-29" })
    ).toThrow("referenceOn");
  });
});

describe("containsCivilDate", () => {
  const period = {
    kind: "week" as const,
    referenceOn: "2026-08-19",
    startOnInclusive: "2026-08-17",
    endOnExclusive: "2026-08-24"
  };

  it("uses half-open interval boundaries", () => {
    expect(containsCivilDate(period, "2026-08-17")).toBe(true);
    expect(containsCivilDate(period, "2026-08-23")).toBe(true);
    expect(containsCivilDate(period, "2026-08-24")).toBe(false);
  });
});
