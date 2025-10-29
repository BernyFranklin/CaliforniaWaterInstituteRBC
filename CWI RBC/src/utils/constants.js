// Mathematical and conversion constants for recharge basin calculations

// Volume conversions
export const CUFT_IN_CUYD = 27;

// Area conversions  
export const SQMI_PER_ACRE = 1/640;
export const SQFT_IN_SQYD = 9;
export const SQYD_IN_ACRE = 4840;

// Flow conversions
export const FT_PER_DAY_TO_CFS = 1.98;

// Default cost values (can be overridden by form data)
export const PIPELINE_INLET_COST = 20000;
export const PIPELINE_COST_PER_FT = 200;
export const FENCING_COST_PER_FT = 6;
export const ENGINEERING_PERCENTAGE = 0.2;

// Default loss assumptions
export const ANNUAL_EVAP_LOSS_DEFAULT = 30; // percent

// Pipeline specifications
export const FILL_RATE_MULTIPLIER = 1.5; // for 54" pipe fill rate calculation