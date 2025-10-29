// Financial and ROI-related calculations for recharge basin
import { FT_PER_DAY_TO_CFS, FILL_RATE_MULTIPLIER } from '../constants.js';

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

/**
 * Compute annual capital payment using percentage rate
 */
export const computeAnnualCapitalPayment = (annualRatePct, years, totalCost) => {
  return pmt(annualRatePct / 100, years, totalCost);
};

/**
 * Average annual recharge depth (ft/day * acres)
 */
export const computeAvgAnnualRechargeDepth = (infiltrationRateFtPerDay, wettedAreaAcres) => {
  return infiltrationRateFtPerDay * wettedAreaAcres;
};

/**
 * Net recharge in AF/yr
 */
export const computeNetRecharge = (avgAnnualRechargeDepth, wetMonths, wetYearFreqPct, evapLossPct) => {
  return avgAnnualRechargeDepth * 30 * wetMonths * (wetYearFreqPct / 100) * (1 - (evapLossPct / 100));
};

/**
 * Annual capital cost per AF with divide-by-zero guard
 */
export const computeAnnualCapitalCostPerAF = (annualCapitalPayment, netRecharge) => {
  if (!netRecharge || netRecharge <= 0) return 0;
  return annualCapitalPayment / netRecharge;
};

/**
 * Total annual cost per AF
 */
export const computeTotalAnnualCostPerAF = (annualCapitalCostPerAF, costRechargeWater, costOM) => {
  return annualCapitalCostPerAF + costRechargeWater + costOM;
};

/**
 * Net benefit per AF
 */
export const computeNetBenefitPerAF = (valueStoredWater, totalAnnualCostPerAF) => {
  return valueStoredWater - totalAnnualCostPerAF;
};

/**
 * Convert ft/day to cfs for recharge flow
 */
export const computeRechargeFlowCfs = (avgAnnualRechargeDepthFtPerDay) => {
  if (!FT_PER_DAY_TO_CFS) return 0;
  return avgAnnualRechargeDepthFtPerDay / FT_PER_DAY_TO_CFS;
};

/**
 * Fill rate using a multiplier (e.g., 54" pipe)
 */
export const computeFillRate54InPipe = (rechargeFlowCfs) => {
  return rechargeFlowCfs * FILL_RATE_MULTIPLIER;
};
