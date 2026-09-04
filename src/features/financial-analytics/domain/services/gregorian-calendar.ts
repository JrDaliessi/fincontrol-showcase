export function isGregorianLeapYear(year: number): boolean {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

export function daysInGregorianMonth(year: number, month: number): number {
  const monthLengths = [
    31,
    isGregorianLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ] as const;

  return monthLengths[month - 1] ?? 0;
}
