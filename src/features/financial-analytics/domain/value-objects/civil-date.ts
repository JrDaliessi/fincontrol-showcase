import { daysInGregorianMonth } from "../services/gregorian-calendar";

const CIVIL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export class CivilDate {
  private constructor(readonly value: string) {}

  static fromString(value: string): CivilDate {
    const match = CIVIL_DATE_PATTERN.exec(value);

    if (!match) {
      throw new Error("civil date is invalid");
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (
      year === 0 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > daysInGregorianMonth(year, month)
    ) {
      throw new Error("civil date is invalid");
    }

    return new CivilDate(value);
  }
}
