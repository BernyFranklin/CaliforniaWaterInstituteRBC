import { getCalculationsData } from '../utils/calculations/aggregateCalculations.js';
import { formatWithCommas } from '../utils/formatters.js';

// Local component styles so this is standalone
const styles = {
  container: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  fieldset: {
    borderRadius: '5px',
    border: '3px solid #ccc',
    padding: '1.25rem',
    marginTop: 0,
    textAlign: 'left',
    width: '32%',
    boxSizing: 'border-box',
  },
  legend: {
    fontFamily: 'inherit',
    fontSize: '1.5rem',
    padding: '0.5rem',
  },
  group: {
    display: 'flex',
    textWrap: 'nowrap',
  },
  label: {
    justifyContent: 'flex-start',
    width: '50%',
    fontWeight: 600,
  },
  value: {
    textAlign: 'right',
    width: '50%',
  },
};

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
    <div className="calculation-data-section" style={styles.container}>
      <fieldset className="calculation-fieldset" id="dimensions-fieldset" style={styles.fieldset}>
        <legend className="fieldset-label" style={styles.legend}>Dimensions</legend>
        {dimensionData.map((data) => (
          <div className="display-group" style={styles.group} key={data.label}>
            <span className="display-label" style={styles.label}>{data.label}:</span>
            <span className="display-value" style={styles.value}>{data.value}</span>
          </div>
        ))}
      </fieldset>
      <fieldset className="calculation-fieldset" id="earthwork-fieldset" style={styles.fieldset}>
        <legend className="fieldset-label" style={styles.legend}>Earthwork</legend>
        {earthworkData.map((data) => (
          <div className="display-group" style={styles.group} key={data.label}>
            <span className="display-label" style={styles.label}>{data.label}:</span>
            <span className="display-value" style={styles.value}>{data.value}</span>
          </div>
        ))}
      </fieldset>
      <fieldset className="calculation-fieldset" id="wetted-area-fieldset" style={styles.fieldset}>
        <legend className="fieldset-label" style={styles.legend}>Wetted Area</legend>
        {wettedAreaData.map((data) => (
          <div className="display-group" style={styles.group} key={data.label}>
            <span className="display-label" style={styles.label}>{data.label}:</span>
            <span className="display-value" style={styles.value}>{data.value}</span>
          </div>
        ))}
      </fieldset>
    </div>
  );
}
