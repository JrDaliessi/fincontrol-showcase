import { CivilDate } from "../value-objects/civil-date";
import { daysInGregorianMonth } from "./gregorian-calendar";
import type {
  FinancialPeriod,
  FinancialPeriodKind
} from "../types/financial-period.types";

type CivilDateParts = {
  year: number;
  month: number;
  day: number;
};

const supportedKinds: readonly FinancialPeriodKind[] = [
  "week",
  "rolling_7_days",
  "fortnight",
  "rolling_15_days",
  "month"
];

function isFinancialPeriodKind(value: unknown): value is FinancialPeriodKind {
  return supportedKinds.includes(value as FinancialPeriodKind);
}

function parseCivilDate(value: string): CivilDateParts {
  const canonicalValue = CivilDate.fromString(value).value;
  const [year, month, day] = canonicalValue.split("-").map(Number);

  return { year, month, day };
}

function formatCivilDate(parts: CivilDateParts): string {
  if (parts.year < 1 || parts.year > 9999) {
    throw new Error("civil date is out of range");
  }

  return `${parts.year.toString().padStart(4, "0")}-${parts.month
    .toString()
    .padStart(2, "0")}-${parts.day.toString().padStart(2, "0")}`;
}

function addCivilDays(value: string, amount: number): string {
  const parts = parseCivilDate(value);
  const direction = Math.sign(amount);

  for (let remaining = Math.abs(amount); remaining > 0; remaining -= 1) {
    parts.day += direction;

    if (
      direction > 0 &&
      parts.day > daysInGregorianMonth(parts.year, parts.month)
    ) {
      parts.day = 1;
      parts.month += 1;

      if (parts.month > 12) {
        parts.month = 1;
        parts.year += 1;
      }
    }

    if (direction < 0 && parts.day < 1) {
      parts.month -= 1;

      if (parts.month < 1) {
        parts.month = 12;
        parts.year -= 1;
      }

      if (parts.year < 1 || parts.year > 9999) {
        throw new Error("civil date is out of range");
      }

      parts.day = daysInGregorianMonth(parts.year, parts.month);
    }

    if (parts.year < 1 || parts.year > 9999) {
      throw new Error("civil date is out of range");
    }
  }

  return formatCivilDate(parts);
}

function mondayBasedWeekday(value: string): number {
  const { year, month, day } = parseCivilDate(value);
  const previousYears = year - 1;
  const daysBeforeYear =
    previousYears * 365 +
    Math.floor(previousYears / 4) -
    Math.floor(previousYears / 100) +
    Math.floor(previousYears / 400);
  let daysBeforeMonth = 0;

  for (let currentMonth = 1; currentMonth < month; currentMonth += 1) {
    daysBeforeMonth += daysInGregorianMonth(year, currentMonth);
  }

  return (daysBeforeYear + daysBeforeMonth + day - 1) % 7;
}

function firstDayOfMonth(value: string): string {
  const { year, month } = parseCivilDate(value);

  return formatCivilDate({ year, month, day: 1 });
}

function firstDayOfNextMonth(value: string): string {
  const { year, month } = parseCivilDate(value);

  return month === 12
    ? formatCivilDate({ year: year + 1, month: 1, day: 1 })
    : formatCivilDate({ year, month: month + 1, day: 1 });
}

export type ResolveFinancialPeriodInput = {
  kind: FinancialPeriodKind;
  referenceOn: string;
};

export function resolveFinancialPeriod(
  input: ResolveFinancialPeriodInput
): FinancialPeriod {
  if (!isFinancialPeriodKind(input.kind)) {
    throw new Error("period kind is invalid");
  }

  let referenceOn: string;

  try {
    referenceOn = CivilDate.fromString(input.referenceOn).value;
  } catch {
    throw new Error("referenceOn is invalid");
  }

  let startOnInclusive: string;
  let endOnExclusive: string;

  switch (input.kind) {
    case "week":
      startOnInclusive = addCivilDays(
        referenceOn,
        -mondayBasedWeekday(referenceOn)
      );
      endOnExclusive = addCivilDays(startOnInclusive, 7);
      break;
    case "rolling_7_days":
      startOnInclusive = addCivilDays(referenceOn, -6);
      endOnExclusive = addCivilDays(referenceOn, 1);
      break;
    case "fortnight": {
      const { year, month, day } = parseCivilDate(referenceOn);
      startOnInclusive = formatCivilDate({
        year,
        month,
        day: day <= 15 ? 1 : 16
      });
      endOnExclusive =
        day <= 15
          ? formatCivilDate({ year, month, day: 16 })
          : firstDayOfNextMonth(referenceOn);
      break;
    }
    case "rolling_15_days":
      startOnInclusive = addCivilDays(referenceOn, -14);
      endOnExclusive = addCivilDays(referenceOn, 1);
      break;
    case "month":
      startOnInclusive = firstDayOfMonth(referenceOn);
      endOnExclusive = firstDayOfNextMonth(referenceOn);
      break;
  }

  return {
    kind: input.kind,
    referenceOn,
    startOnInclusive,
    endOnExclusive
  };
}
