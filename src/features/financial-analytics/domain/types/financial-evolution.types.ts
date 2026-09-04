export type FinancialMovementType = "income" | "expense";

export type FinancialMovementProjection = Readonly<{
  id: string;
  occurredOn: string;
  createdAt: string;
  type: FinancialMovementType;
  amountInCents: number;
}>;

export type FinancialEvolutionPoint = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
  incomeInCents: number;
  expenseInCents: number;
  netInCents: number;
  closingBalanceInCents: number;
  transactionCount: number;
}>;

export type FinancialEvolutionSnapshot = Readonly<{
  accountCount: number;
  openingBalanceInCents: number;
  movements: readonly FinancialMovementProjection[];
}>;
