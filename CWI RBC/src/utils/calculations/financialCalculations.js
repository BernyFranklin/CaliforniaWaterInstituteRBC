// Financial and ROI-related calculations for recharge basin

/**
 * Excel-like PMT function: periodic payment for an annuity
 * @param {number} rate - Periodic interest rate (e.g., annual rate per year)
 * @param {number} nper - Total number of payment periods
 * @param {number} pv - Present value (loan principal), positive number
 * @returns {number} Payment amount per period (negative of Excel PMT sign convention)
 */
export const pmt = (rate, nper, pv) => {
  if (rate === 0) return -(pv / nper);
  return (rate * pv) / (1 - Math.pow(1 + rate, -nper));
};

// Placeholders for future extractions, if desired:
// export const annualCapitalPayment = (annualRatePct, years, totalCost) => pmt(annualRatePct / 100, years, totalCost);
// export const avgAnnualRechargeDepth = (infiltrationRate, wettedAreaAcres) => infiltrationRate * wettedAreaAcres;
// export const netRecharge = (avgDepth, wetMonths, wetYearFreqPct, evapLossPct) => avgDepth * 30 * wetMonths * (wetYearFreqPct / 100) * (1 - (evapLossPct / 100));
