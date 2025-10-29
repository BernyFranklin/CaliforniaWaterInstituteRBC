// Aggregate calculation helpers used by UI components
import {
  CUFT_IN_CUYD,
  SQMI_PER_ACRE,
  PIPELINE_INLET_COST,
  PIPELINE_COST_PER_FT,
  FENCING_COST_PER_FT,
  ENGINEERING_PERCENTAGE,
  ANNUAL_EVAP_LOSS_DEFAULT
} from '../constants.js';

import { calculateAllEarthwork } from './earthworkCalculations.js';
import { calculateAllWettedArea } from './wettedAreaCalculations.js';

import {
  computeAnnualCapitalPayment,
  computeAvgAnnualRechargeDepth,
  computeNetRecharge,
  computeAnnualCapitalCostPerAF,
  computeTotalAnnualCostPerAF,
  computeNetBenefitPerAF,
  computeRechargeFlowCfs,
  computeFillRate54InPipe
} from './financialCalculations.js';

export const getCalculationsData = (formData) => {
  const area_sqmi = formData.ac_pond * SQMI_PER_ACRE;

  // Calculate all earthwork values using the earthwork module
  const earthworkResults = calculateAllEarthwork(formData);
  const { perimeter, center_of_levee, inside_of_levee, outside_of_levee, total_volume_of_earthwork, total_cost_of_earthwork } = earthworkResults;

  // Calculate all wetted area values using the wetted area module
  const wettedAreaResults = calculateAllWettedArea(formData, perimeter);
  const { outside_length_wetted_area, less_outside_levee, less_top_levee, less_inside_levee, plus_wetted_inside_levee, net_inside_length_wetted_area, wetted_area_sq_yds, wetted_area_acres, wetted_area_gross_percent } = wettedAreaResults;

  return {
    cuft_in_cuyd: CUFT_IN_CUYD,
    sqmi_per_acre: SQMI_PER_ACRE,
    area_sqmi,
    perimeter,
    center_of_levee,
    inside_of_levee,
    outside_of_levee,
    total_volume_of_earthwork,
    total_cost_of_earthwork,
    outside_length_wetted_area,
    less_outside_levee,
    less_top_levee,
    less_inside_levee,
    plus_wetted_inside_levee,
    net_inside_length_wetted_area,
    wetted_area_sq_yds,
    wetted_area_acres,
    wetted_area_gross_percent
  };
}

export const getOutputCalculations = (formData) => {
  const calculations = getCalculationsData(formData);
  const landCost = formData.ac_pond * formData.land_cost_per_acre;
  const pipelineInletCost = PIPELINE_INLET_COST;
  const pipelineCostPerFt = PIPELINE_COST_PER_FT;
  const pipelineTotalCost = formData.pipeline_length * pipelineCostPerFt;
  const fencingQty = 0;
  const fencingCostPerFt = FENCING_COST_PER_FT; // Placeholder value for fencing cost per ft
  const fencingTotalCost = fencingQty * fencingCostPerFt;
  const subtotal = landCost + calculations.total_cost_of_earthwork + pipelineInletCost + pipelineTotalCost + fencingTotalCost;
  const engineeringCost = subtotal * ENGINEERING_PERCENTAGE;
  const totalCostEstimate = subtotal + engineeringCost;

  const annualCapitalPayment = computeAnnualCapitalPayment(formData.annual_interest_rate, formData.loan_length, totalCostEstimate);
  const avgAnnualRechargeDepth = computeAvgAnnualRechargeDepth(formData.infiltration_rate, calculations.wetted_area_acres);
  const annualEvapLossNotIncluded = ANNUAL_EVAP_LOSS_DEFAULT; // Can be parameterized via UI later
  const netRecharge = computeNetRecharge(avgAnnualRechargeDepth, formData.num_wet_months, formData.wet_year_freq, annualEvapLossNotIncluded);
  const annualCapitalCostPerAF = computeAnnualCapitalCostPerAF(annualCapitalPayment, netRecharge);
  const totalAnnualCostPerAF = computeTotalAnnualCostPerAF(annualCapitalCostPerAF, formData.cost_recharge_water, formData.cost_om);
  const netBenefitPerAF = computeNetBenefitPerAF(formData.value_stored_water, totalAnnualCostPerAF);
  const rechargeFlowCfs = computeRechargeFlowCfs(avgAnnualRechargeDepth);
  const fillRate54InPipe = computeFillRate54InPipe(rechargeFlowCfs);

  const outputs = [
    { label: "Land Purchase", quantity: formData.ac_pond, quantity_unit: "acres", unit_cost: formData.land_cost_per_acre, unit_cost_units: "acre", cost: landCost, cost_per_acre: formData.land_cost_per_acre },
    { label: "Earthwork", quantity: calculations.total_volume_of_earthwork, quantity_unit: "cubic yards", unit_cost: formData.earthwork_cost_per_cy, unit_cost_units: "cubic yard", cost: calculations.total_cost_of_earthwork, cost_per_acre: (calculations.total_cost_of_earthwork / formData.ac_pond) },
    { label: "Pipeline Inlets", quantity: 1, quantity_unit: "each", unit_cost: pipelineInletCost, unit_cost_units: "each", cost: pipelineInletCost, cost_per_acre: (pipelineInletCost / formData.ac_pond) },
    { label: "Pipeline (30)", quantity: formData.pipeline_length, quantity_unit: "feet", unit_cost: pipelineCostPerFt, unit_cost_units: "foot", cost: pipelineTotalCost, cost_per_acre: (pipelineTotalCost / formData.ac_pond) },
    { label: "Fencing", quantity: 0, quantity_unit: "feet", unit_cost: fencingCostPerFt, unit_cost_units: "foot", cost: fencingTotalCost, cost_per_acre: (fencingTotalCost / formData.ac_pond) },
    { label: "Subtotal", quantity: null, quantity_unit: "", unit_cost: null, unit_cost_units: "", cost: subtotal, cost_per_acre: subtotal / formData.ac_pond },
    { label: `Engineering and Contingency (${ENGINEERING_PERCENTAGE * 100}%)`, quantity: null, quantity_unit: "", unit_cost: null, unit_cost_units: "", cost: engineeringCost, cost_per_acre: engineeringCost / formData.ac_pond },
    { label: "Total Cost Estimate", quantity: null, quantity_unit: "", unit_cost: null, unit_cost_units: "", cost: totalCostEstimate, cost_per_acre: totalCostEstimate / formData.ac_pond },
    { label: "Annual Capital Payment", quantity: null, quantity_unit: "", unit_cost: annualCapitalPayment, unit_cost_units: "year", cost: null, cost_per_acre: null },
    { label: "Average Annual Recharge Depth", quantity: avgAnnualRechargeDepth, quantity_unit: "feet / day", unit_cost: null, unit_cost_units: "", cost: null, cost_per_acre: null },
    { label: "Net Recharge (Applied Water - Evaporation Loss)", quantity: netRecharge, quantity_unit: "acre-feet / year", unit_cost: null, unit_cost_units: "", cost: null, cost_per_acre: null },
    { label: "Annual Capital Cost per Acre-Foot", quantity: null, quantity_unit: "", unit_cost: annualCapitalCostPerAF, unit_cost_units: "acre-foot", cost: null, cost_per_acre: null },
    { label: "Water Purchase Cost of Recharge Water", quantity: null, quantity_unit: "", unit_cost: formData.cost_recharge_water, unit_cost_units: "acre-foot", cost: null, cost_per_acre: null },
    { label: "O&M Cost for Recharge and Basin Maintenance", quantity: null, quantity_unit: "", unit_cost: formData.cost_om, unit_cost_units: "acre-foot", cost: null, cost_per_acre: null },
    { label: "Total Annual Cost per Acre-Foot of Recharged Water", quantity: null, quantity_unit: "", unit_cost: totalAnnualCostPerAF, unit_cost_units: "acre-foot", cost: null, cost_per_acre: null },
    { label: "Net Benefit per Acre-Foot", quantity: null, quantity_unit: "", unit_cost: netBenefitPerAF, unit_cost_units: "acre-foot", cost: null, cost_per_acre: null },
    { label: "Recharge Flow", quantity: rechargeFlowCfs, quantity_unit: "cfs", unit_cost: null, unit_cost_units: "", cost: null, cost_per_acre: null },
    { label: "Fill Rate (54\" pipe)", quantity: fillRate54InPipe, quantity_unit: "cfs", unit_cost: null, unit_cost_units: "", cost: null, cost_per_acre: null }
  ];

  return outputs;
}
