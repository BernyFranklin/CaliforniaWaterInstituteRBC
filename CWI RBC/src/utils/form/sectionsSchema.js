// Shared form schema for Recharge Basin Calculator sections

export const soilOptions = [
  { value: 'sand', text: 'Sand' },
  { value: 'sandy_fine_layering', text: 'Sandy with some fine layering' },
  { value: 'loam', text: 'Loam' },
  { value: 'loam_fine_layering', text: 'Loam with some fine layering' },
  { value: 'silt_clay_loam', text: 'Silt or Clay Loam' },
  { value: 'silt_clay_loam_fine_layering', text: 'Silt or Clay Loam with some fine layering' },
  { value: 'clay_restrictive_layers', text: 'Clay soil with restrictive layers' },
];

export const sections = {
  basinSizeAndDesign: {
    id: 'basinSizeAndDesign',
    legend: 'Basin Size and Design',
    fields: [
      { text: 'Acres of Pond Surface Area', id: 'ac_pond', type: 'number', min: 0, placeholder: '160' },
      { text: 'Length of Pond (ft)', id: 'length_pond', type: 'number', min: 0, placeholder: '2640' },
      { text: 'Width of Pond (ft)', id: 'width_pond', type: 'number', min: 0, placeholder: '2640' },
      { text: 'Inside Slope Ratio (N:1)', id: 'inside_slope_ratio', type: 'number', min: 0, placeholder: '4' },
      { text: 'Outside Slope Ratio (N:1)', id: 'outside_slope_ratio', type: 'number', min: 0, placeholder: '2' },
      { text: 'Levee Width (ft)', id: 'levee_width', type: 'number', min: 0, placeholder: '8' },
      { text: 'Slope Across Pond (N:1ft)', id: 'slope_across_pond', type: 'number', min: 0, step: 0.1, placeholder: '0.5' },
      { text: 'Freeboard Depth (ft)', id: 'freeboard_depth', type: 'number', min: 0, placeholder: '1' },
      { text: 'Water Depth (ft)', id: 'water_depth', type: 'number', min: 0, placeholder: '1' },
      { text: 'Infiltration Rate (ft/day)', id: 'infiltration_rate', type: 'number', min: 0, placeholder: '0.6' },
      { text: 'Soil Type', id: 'soil_type', type: 'select', options: soilOptions },
    ],
  },
  waterAvailability: {
    id: 'waterAvailability',
    legend: 'Water Availability',
    fields: [
      { text: 'Wet Year Frequency (%)', id: 'wet_year_freq', type: 'number', min: 0, max: 100, placeholder: '30' },
      { text: '# of Wet Months Per Year', id: 'num_wet_months', type: 'number', min: 0, max: 12, placeholder: '4' },
    ],
  },
  developmentCosts: {
    id: 'developmentCosts',
    legend: 'Development Costs',
    fields: [
      { text: 'Land Cost Per Acre', id: 'land_cost_per_acre', type: 'number', min: 0, placeholder: '6000' },
      { text: 'Total ft of Pipeline', id: 'pipeline_length', type: 'number', min: 0, placeholder: '2640' },
      { text: 'Cost per Cubic Yd of Earthwork', id: 'earthwork_cost_per_cy', type: 'number', min: 0, placeholder: '12' },
      { text: 'Annual Interest Rate (%)', id: 'annual_interest_rate', type: 'number', min: 0, max: 100, placeholder: '5' },
      { text: 'Length of Loan (Years)', id: 'loan_length', type: 'number', min: 0, placeholder: '10' },
    ],
  },
  waterCosts: {
    id: 'waterCosts',
    legend: 'Water Costs',
    fields: [
      { text: 'Cost of Reacharge Water ($/AF)', id: 'cost_recharge_water', type: 'number', min: 0, placeholder: '35' },
      { text: 'Value of Stored Water ($/AF)', id: 'value_stored_water', type: 'number', min: 0, placeholder: '200' },
      { text: 'Cost of O&M ($/AF)', id: 'cost_om', type: 'number', min: 0, placeholder: '5' },
    ],
  },
};

export function findFieldById(fieldId) {
  for (const section of Object.values(sections)) {
    const found = section.fields.find((f) => f.id === fieldId);
    if (found) return found;
  }
  return undefined;
}
