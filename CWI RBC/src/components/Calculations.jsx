import { useState } from 'react';
import {
  CUFT_IN_CUYD,
  SQMI_PER_ACRE,
  SQFT_IN_SQYD,
  SQYD_IN_ACRE,
  FT_PER_DAY_TO_CFS,
  PIPELINE_INLET_COST,
  PIPELINE_COST_PER_FT,
  FENCING_COST_PER_FT,
  ENGINEERING_PERCENTAGE,
  ANNUAL_EVAP_LOSS_DEFAULT,
  FILL_RATE_MULTIPLIER
} from '../utils/constants.js';

import {
  calculateAllEarthwork
} from '../utils/calculations/earthworkCalculations.js';

import {
  calculateAllWettedArea
} from '../utils/calculations/wettedAreaCalculations.js';

// Earthwork calculations moved to ../utils/calculations/earthworkCalculations.js

// Wetted area calculations moved to ../utils/calculations/wettedAreaCalculations.js

export const getCalculationsData = (formData) => {
  // Calculations Section from spreadsheet
  const area_sqmi = formData.ac_pond * SQMI_PER_ACRE;
  
  // Calculate all earthwork values using the earthwork module
  const earthworkResults = calculateAllEarthwork(formData);
  const { perimeter, center_of_levee, inside_of_levee, outside_of_levee, total_volume_of_earthwork, total_cost_of_earthwork } = earthworkResults;
  
  // Calculate all wetted area values using the wetted area module
  const wettedAreaResults = calculateAllWettedArea(formData, perimeter);
  const { outside_length_wetted_area, less_outside_levee, less_top_levee, less_inside_levee, plus_wetted_inside_levee, net_inside_length_wetted_area, wetted_area_sq_yds, wetted_area_acres, wetted_area_gross_percent } = wettedAreaResults;
  // End of global vars and functions
  return {
    cuft_in_cuyd: CUFT_IN_CUYD,
    sqmi_per_acre: SQMI_PER_ACRE,
    area_sqmi: area_sqmi,
    perimeter: perimeter,
    center_of_levee: center_of_levee,
    inside_of_levee: inside_of_levee,
    outside_of_levee: outside_of_levee,
    total_volume_of_earthwork: total_volume_of_earthwork,
    total_cost_of_earthwork: total_cost_of_earthwork,
    outside_length_wetted_area: outside_length_wetted_area,
    less_outside_levee: less_outside_levee,
    less_top_levee: less_top_levee,
    less_inside_levee: less_inside_levee,
    plus_wetted_inside_levee: plus_wetted_inside_levee,
    net_inside_length_wetted_area: net_inside_length_wetted_area,
    wetted_area_sq_yds: wetted_area_sq_yds,
    wetted_area_acres: wetted_area_acres,
    wetted_area_gross_percent: wetted_area_gross_percent
  };
}

const getEngineeringFirms = () => {
    return [
        {name: "Provost and Pritchard", url: "https://provostandpritchard.com/"}
    ];
}

export const getOutputCalculations = (formData) => {
  // used for annual capital payment
  const pmt = (rate, nper, pv) => {
    if (rate === 0) return -(pv / nper);
    return (rate * pv) / (1 - Math.pow(1 + rate, -nper));
  }
    
  // Calculations and values for Outputs Section
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
  const annualCapitalPayment = pmt(formData.annual_interest_rate / 100, formData.loan_length, totalCostEstimate);
  const avgAnnualRechargeDepth = formData.infiltration_rate * calculations.wetted_area_acres;
  const [annualEvapLossNotIncluded, setAnnualEvapLossNotIncluded] = useState(ANNUAL_EVAP_LOSS_DEFAULT); // Use for user manip later
  const netRecharge = (avgAnnualRechargeDepth * 30 * formData.num_wet_months * (formData.wet_year_freq / 100) * (1 - (annualEvapLossNotIncluded / 100)));
  const annualCapitalCostPerAF = annualCapitalPayment / netRecharge;
  const totalAnnualCostPerAF = annualCapitalCostPerAF + formData.cost_recharge_water + formData.cost_om;
  const netBenefitPerAF = formData.value_stored_water - totalAnnualCostPerAF;
  const rechargeFlowCfs = avgAnnualRechargeDepth / FT_PER_DAY_TO_CFS;
  const fillRate54InPipe = rechargeFlowCfs * FILL_RATE_MULTIPLIER;

  
  const outputs = [
    { label: "Land Purchase", 
        quantity: formData.ac_pond, 
        quantity_unit: "acres", 
        unit_cost: formData.land_cost_per_acre, 
        unit_cost_units: "acre",
        cost: landCost, 
        cost_per_acre: formData.land_cost_per_acre 
    },
    { label: "Earthwork",
        quantity: calculations.total_volume_of_earthwork,
        quantity_unit: "cubic yards",
        unit_cost: formData.earthwork_cost_per_cy,
        unit_cost_units: "cubic yard",
        cost: calculations.total_cost_of_earthwork,
        cost_per_acre: (calculations.total_cost_of_earthwork / formData.ac_pond)
    },
    { label: "Pipeline Inlets",
        quantity: 1,
        quantity_unit: "each",
        unit_cost: pipelineInletCost,
        unit_cost_units: "each",
        cost: pipelineInletCost,
        cost_per_acre: (pipelineInletCost / formData.ac_pond)
    },
    { label: "Pipeline (30)",
        quantity: formData.pipeline_length,
        quantity_unit:"feet",
        unit_cost: pipelineCostPerFt,
      unit_cost_units: "foot",
      cost: pipelineTotalCost,
      cost_per_acre: (pipelineTotalCost / formData.ac_pond)
    },
    // Add input variable for fencing 
    { label: "Fencing",
        quantity: 0,
        quantity_unit: "feet",
        unit_cost: fencingCostPerFt,
        unit_cost_units: "foot",
        cost: fencingTotalCost,
        cost_per_acre: (fencingTotalCost / formData.ac_pond)
    },
    // keeping same shape for object to not break table structure
    { label: "Subtotal",
        quantity: null,
        quantity_unit: "",
        unit_cost: null,
        unit_cost_units: "",
      cost: subtotal,
      cost_per_acre: subtotal / formData.ac_pond
    },
    { label: `Engineering and Contingency (${ENGINEERING_PERCENTAGE * 100}%)`,
    quantity: null,
      quantity_unit: "",
      unit_cost: null,   
      unit_cost_units: "",
      cost: engineeringCost,
      cost_per_acre: engineeringCost / formData.ac_pond
    },
    { label: "Total Cost Estimate",
      quantity: null,
      quantity_unit: "",
      unit_cost: null,
      unit_cost_units: "",
      cost: totalCostEstimate,
      cost_per_acre: totalCostEstimate / formData.ac_pond
     },
     { label: "Annual Capital Payment",
        quantity: null,
      quantity_unit: "",
      unit_cost: annualCapitalPayment,
      unit_cost_units: "year",
      cost: null,
      cost_per_acre: null
    },
    { label: "Average Annual Recharge Depth",
      quantity: avgAnnualRechargeDepth,
      quantity_unit: "feet / day",
      unit_cost: null,
      unit_cost_units: "",
      cost: null,
      cost_per_acre: null
    },
     { label: "Net Recharge (Applied Water - Evaporation Loss)",
        quantity: netRecharge,
        quantity_unit: "acre-feet / year",
        unit_cost: null,
        unit_cost_units: "",
        cost: null,
        cost_per_acre: null
    },
    { label: "Annual Capital Cost per Acre-Foot",
        quantity: null,
        quantity_unit: "",
        unit_cost: annualCapitalCostPerAF,
        unit_cost_units: "acre-foot",
        cost: null,
        cost_per_acre: null
    },
    { label: "Water Purchase Cost of Recharge Water",
      quantity: null,
      quantity_unit: "",
      unit_cost: formData.cost_recharge_water,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "O&M Cost for Recharge and Basin Maintenance",
        quantity: null,
        quantity_unit: "",
        unit_cost: formData.cost_om,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
    },
    { label: "Total Annual Cost per Acre-Foot of Recharged Water",
      quantity: null,
      quantity_unit: "",
      unit_cost: totalAnnualCostPerAF,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
    },
    { label: "Net Benefit per Acre-Foot",
        quantity: null,
        quantity_unit: "",
        unit_cost: netBenefitPerAF,
        unit_cost_units: "acre-foot",
        cost: null,
        cost_per_acre: null
    },
    { label: "Recharge Flow",
        quantity: rechargeFlowCfs,
        quantity_unit: "cfs",
        unit_cost: null,
      unit_cost_units: "",
      cost: null,
      cost_per_acre: null
    },
    { label: "Fill Rate (54\" pipe)",
      quantity: fillRate54InPipe,
      quantity_unit: "cfs",
      unit_cost: null,
      unit_cost_units: "",
      cost: null,
      cost_per_acre: null
    }
];

return outputs;
}

export function CalculationDataSection({formData}) {
  const calculations = getCalculationsData(formData);
  const formatWithCommas = (num) => {
    return num.toLocaleString( 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
  const dimensionData = [
    { label: "Area", value: `${calculations.area_sqmi} sq mi` },
    { label: "Perimeter", value: `${formatWithCommas(calculations.perimeter)} ft` }
  ];

  const earthworkData = [
    { label: "Center of Levee", value: `${formatWithCommas(calculations.center_of_levee)} cu yd` },
    { label: "Inside of Levee", value: `${formatWithCommas(calculations.inside_of_levee)} cu yd` },
    { label: "Outside of Levee", value: `${formatWithCommas(calculations.outside_of_levee)} cu yd` },
    { label: "Total Volume of Earthwork", value: `${formatWithCommas(calculations.total_volume_of_earthwork)} cu yd` },
    { label: "Total Cost of Earthwork", value: `$${formatWithCommas(calculations.total_cost_of_earthwork)}` }
  ];

  const wettedAreaData = [
    { label: "Outside Length", value: `${formatWithCommas(calculations.outside_length_wetted_area)} ft` },
    { label: "Less Outside Levee", value: `${formatWithCommas(calculations.less_outside_levee)} ft` },
    { label: "Less Top Levee", value: `${formatWithCommas(calculations.less_top_levee)} ft` },
    { label: "Less Inside Levee", value: `${formatWithCommas(calculations.less_inside_levee)} ft` },
    { label: "Plus Wetted Inside Levee", value: `${formatWithCommas(calculations.plus_wetted_inside_levee)} ft` },
    { label: "Net Inside Length", value: `${formatWithCommas(calculations.net_inside_length_wetted_area)} ft` },
    { label: "Wetted Area (sq yds)", value: `${formatWithCommas(calculations.wetted_area_sq_yds)} sq yds` },
    { label: "Wetted Area (acres)", value: `${formatWithCommas(calculations.wetted_area_acres)} acres` },
    { label: "Wetted Area (gross %)", value: `${formatWithCommas(calculations.wetted_area_gross_percent)} %` }
  ];

  return (
    <div className="calculation-data-section">
      <fieldset className="calculation-fieldset" id="dimensions-fieldset">
        <legend className="fieldset-label">Dimensions</legend>
        {dimensionData.map((data) => (
          <div className="display-group" key={data.label}>
            <span className="display-label">{data.label}:</span>
            <span className="display-value">{data.value}</span>
          </div>
        ))}
      </fieldset>
      <fieldset className="calculation-fieldset" id="earthwork-fieldset">
        <legend className="fieldset-label">Earthwork</legend>
        {earthworkData.map((data) => (
          <div className="display-group" key={data.label}>
            <span className="display-label">{data.label}:</span>
            <span className="display-value">{data.value}</span>
          </div>
        ))}
      </fieldset>
      <fieldset className="calculation-fieldset" id="wetted-area-fieldset">
        <legend className="fieldset-label">Wetted Area</legend>
        {wettedAreaData.map((data) => (
          <div className="display-group" key={data.label}>
            <span className="display-label">{data.label}:</span>
            <span className="display-value">{data.value}</span>
          </div>
        ))}
      </fieldset>
    </div>
  )
}

export function OutputsDataSection({ formData }) {
  // helper functions
  const toPrice = (num) => {
    if (num === null) return "-";
    return num.toLocaleString( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  const formatQty = (num) => {
    if (num === null) return "-";
    return num.toFixed(1);
  }

  const formatUnits = (unit) => {
    if (unit === "") return "";
    return ` / ${unit}`;
  }

  const engineeringFirms = getEngineeringFirms();
  const outputs = getOutputCalculations(formData);

  return (
    <div className="outputs-data-section">
      <fieldset className="calculation-fieldset" id="outputs-fieldset">
        <legend className="fieldset-label">Outputs</legend>
        <table className="outputs-table">
          <thead>
            <tr>
              <th></th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Cost</th>
              <th>Cost per Acre</th>
            </tr>
          </thead>
          <tbody>
            {outputs.map((output) => (
              <tr key={output.label}>
                <th className="outputs-row-title">{output.label}</th>
                <td>{formatQty(output.quantity)} {output.quantity_unit}</td>
                <td>{toPrice(output.unit_cost)}{formatUnits(output.unit_cost_units)}</td>
                <td>{toPrice(output.cost)}</td>
                <td>{toPrice(output.cost_per_acre)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="disclaimer-text">
          <ul>
            <li>
              This tool provides only a preliminary cost estimate. Recharge basins should be professionally designed to reduce the risk of basin failure. Consult with your water district manager regarding the frequency of availability and cost of recharge water.
            </li>
            <li>
              Engineering firms with experience in recharge basin design include:
              <ul>
                {engineeringFirms.map((firm) => (
                  <li key={firm.name}><a href={firm.url} target="_blank">{firm.name}</a></li>
              ))}
            </ul>
            </li>
            <li>
              Annual loss of crop profits not included - If you assume almonds as the crop, the annual loss of profit is $0
            </li>
            <li>
              Annual evaporation losses not included - assume that equals 30%
            </li>
          </ul>
        </div>
      </fieldset>
    </div>
  )
}
