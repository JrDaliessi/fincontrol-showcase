export type FinancialPeriodKind =
  | "week"
  | "rolling_7_days"
  | "fortnight"
  | "rolling_15_days"
  | "month";

export type FinancialPeriod = Readonly<{
  kind: FinancialPeriodKind;
  referenceOn: string;
  startOnInclusive: string;
  endOnExclusive: string;
}>;
