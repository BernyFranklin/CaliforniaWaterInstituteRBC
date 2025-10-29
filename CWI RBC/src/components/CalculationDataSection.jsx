import { getCalculationsData } from '../utils/calculations/aggregateCalculations.js';
import { formatWithCommas } from '../utils/formatters.js';

export default function CalculationDataSection({ formData }) {
  const calculations = getCalculationsData(formData);
  const dimensionData = [
    { label: 'Area', value: `${calculations.area_sqmi} sq mi` },
    { label: 'Perimeter', value: `${formatWithCommas(calculations.perimeter)} ft` }
  ];

  const earthworkData = [
    { label: 'Center of Levee', value: `${formatWithCommas(calculations.center_of_levee)} cu yd` },
    { label: 'Inside of Levee', value: `${formatWithCommas(calculations.inside_of_levee)} cu yd` },
    { label: 'Outside of Levee', value: `${formatWithCommas(calculations.outside_of_levee)} cu yd` },
    { label: 'Total Volume of Earthwork', value: `${formatWithCommas(calculations.total_volume_of_earthwork)} cu yd` },
    { label: 'Total Cost of Earthwork', value: `$${formatWithCommas(calculations.total_cost_of_earthwork)}` }
  ];

  const wettedAreaData = [
    { label: 'Outside Length', value: `${formatWithCommas(calculations.outside_length_wetted_area)} ft` },
    { label: 'Less Outside Levee', value: `${formatWithCommas(calculations.less_outside_levee)} ft` },
    { label: 'Less Top Levee', value: `${formatWithCommas(calculations.less_top_levee)} ft` },
    { label: 'Less Inside Levee', value: `${formatWithCommas(calculations.less_inside_levee)} ft` },
    { label: 'Plus Wetted Inside Levee', value: `${formatWithCommas(calculations.plus_wetted_inside_levee)} ft` },
    { label: 'Net Inside Length', value: `${formatWithCommas(calculations.net_inside_length_wetted_area)} ft` },
    { label: 'Wetted Area (sq yds)', value: `${formatWithCommas(calculations.wetted_area_sq_yds)} sq yds` },
    { label: 'Wetted Area (acres)', value: `${formatWithCommas(calculations.wetted_area_acres)} acres` },
    { label: 'Wetted Area (gross %)', value: `${formatWithCommas(calculations.wetted_area_gross_percent)} %` }
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
  );
}
