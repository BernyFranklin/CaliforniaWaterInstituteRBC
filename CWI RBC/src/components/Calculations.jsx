// Component-only file: import aggregate helpers from utils
import { getCalculationsData, getOutputCalculations } from '../utils/calculations/aggregateCalculations.js';
import {
  formatWithCommas,
  toPrice,
  formatQty,
  formatUnits
} from '../utils/formatters.js';

// Earthwork calculations moved to ../utils/calculations/earthworkCalculations.js

// Wetted area calculations moved to ../utils/calculations/wettedAreaCalculations.js

const getEngineeringFirms = () => {
    return [
        {name: "Provost and Pritchard", url: "https://provostandpritchard.com/"}
    ];
}

export function CalculationDataSection({formData}) {
  const calculations = getCalculationsData(formData);
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
  // formatting helpers are imported from ../utils/formatters.js

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
