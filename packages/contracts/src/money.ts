/**
 * Money is always integer paise. Never float.
 * Percentage rates use fixed-point basis points (1% = 100 bps) — confirm
 * representation before billing implementation (REQUIREMENTS.md open item 5).
 */

export type Paise = number; // integer, >= 0 unless a signed correction

export function assertPaise(value: number): asserts value is Paise {
  if (!Number.isInteger(value)) {
    throw new Error(`Amount must be integer paise, got ${value}`);
  }
}

export function paiseToRupees(paise: Paise): string {
  assertPaise(paise);
  const sign = paise < 0 ? "-" : "";
  const abs = Math.abs(paise);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

export function formatInr(paise: Paise): string {
  return `₹${paiseToRupees(paise)}`;
}

export type BasisPoints = number; // integer; 100 = 1%

/** Late fee for a single day under a percentage policy. */
export function dailyPercentageFeePaise(
  principalPaise: Paise,
  dailyRateBps: BasisPoints,
  dailyCapPaise?: Paise,
): Paise {
  // TODO(phase-0): rounding rule (round vs floor vs ceil) must match the
  // approved late-fee policy before this is used for real bills.
  const raw = Math.round((principalPaise * dailyRateBps) / 10_000);
  return dailyCapPaise !== undefined ? Math.min(raw, dailyCapPaise) : raw;
}
