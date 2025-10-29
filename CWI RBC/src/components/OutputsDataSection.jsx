import { getOutputCalculations } from '../utils/calculations/aggregateCalculations.js';
import { toPrice, formatQty, formatUnits } from '../utils/formatters.js';

const getEngineeringFirms = () => [
  { name: 'Provost and Pritchard', url: 'https://provostandpritchard.com/' }
];

export default function OutputsDataSection({ formData }) {
  const engineeringFirms = getEngineeringFirms();
  const outputs = getOutputCalculations(formData);

  // Local component styles for standalone usage
  const styles = {
    fieldset: {
      borderRadius: '5px',
      border: '3px solid #ccc',
      padding: '1.25rem',
      paddingTop: 0,
      marginTop: 0,
      textAlign: 'left',
      boxSizing: 'border-box',
    },
    legend: {
      fontFamily: 'inherit',
      fontSize: '1.5rem',
      padding: '0.5rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '2rem',
    },
    thHead: {
      textAlign: 'right',
    },
    rowTitle: {
      textAlign: 'left',
    },
    td: {
      textAlign: 'right',
    },
    disclaimer: {
      fontSize: '0.9rem',
      color: '#555',
      marginTop: '1.5rem',
      textAlign: 'left',
    },
    link: {
      display: 'inline-block',
      color: '#193565',
      textDecoration: 'none',
      transition: 'transform 0.3s ease',
    },
  };

  // Hover behavior for links (inline since we aren't using external CSS here)
  const handleLinkEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.textDecoration = 'underline';
  };
  const handleLinkLeave = (e) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.textDecoration = 'none';
  };

  return (
    <div className="outputs-data-section">
      <fieldset className="calculation-fieldset" id="outputs-fieldset" style={styles.fieldset}>
        <legend className="fieldset-label" style={styles.legend}>Outputs</legend>
        <table className="outputs-table" style={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th style={styles.thHead}>Quantity</th>
              <th style={styles.thHead}>Unit Cost</th>
              <th style={styles.thHead}>Cost</th>
              <th style={styles.thHead}>Cost per Acre</th>
            </tr>
          </thead>
          <tbody>
            {outputs.map((output) => (
              <tr key={output.label}>
                <th className="outputs-row-title" style={styles.rowTitle}>{output.label}</th>
                <td style={styles.td}>
                  {formatQty(output.quantity)} {output.quantity_unit}
                </td>
                <td style={styles.td}>
                  {toPrice(output.unit_cost)}
                  {formatUnits(output.unit_cost_units)}
                </td>
                <td style={styles.td}>{toPrice(output.cost)}</td>
                <td style={styles.td}>{toPrice(output.cost_per_acre)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="disclaimer-text" style={styles.disclaimer}>
          <ul>
            <li>
              This tool provides only a preliminary cost estimate. Recharge basins should be professionally designed to reduce the risk of basin failure. Consult with your water district manager regarding the frequency of availability and cost of recharge water.
            </li>
            <li>
              Engineering firms with experience in recharge basin design include:
              <ul>
                {engineeringFirms.map((firm) => (
                  <li key={firm.name}>
                    <a
                      href={firm.url}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.link}
                      onMouseEnter={handleLinkEnter}
                      onMouseLeave={handleLinkLeave}
                    >
                      {firm.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li>Annual loss of crop profits not included - If you assume almonds as the crop, the annual loss of profit is $0</li>
            <li>Annual evaporation losses not included - assume that equals 30%</li>
          </ul>
        </div>
      </fieldset>
    </div>
  );
}
