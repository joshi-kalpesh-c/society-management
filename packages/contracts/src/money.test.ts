import { describe, expect, it } from "vitest";
import {
  assertPaise,
  dailyPercentageFeePaise,
  formatInr,
  paiseToRupees,
} from "./money";

describe("money", () => {
  it("rejects non-integer paise", () => {
    expect(() => assertPaise(10.5)).toThrow();
    expect(() => assertPaise(1050)).not.toThrow();
  });

  it("formats paise as rupees", () => {
    expect(paiseToRupees(12345)).toBe("123.45");
    expect(paiseToRupees(-50)).toBe("-0.50");
    expect(formatInr(0)).toBe("₹0.00");
  });

  it("computes daily percentage fee with cap", () => {
    // 1% of ₹5000 = ₹50 → 5000 bps-of-100bps? rate bps: 1% = 100
    expect(dailyPercentageFeePaise(500_000, 100)).toBe(5_000);
    // capped at ₹20
    expect(dailyPercentageFeePaise(500_000, 100, 2_000)).toBe(2_000);
    // no cap → full amount
    expect(dailyPercentageFeePaise(500_000, 250)).toBe(12_500);
  });
});
