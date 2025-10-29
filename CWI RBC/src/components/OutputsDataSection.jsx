import { getOutputCalculations } from '../utils/calculations/aggregateCalculations.js';
import { toPrice, formatQty, formatUnits } from '../utils/formatters.js';

const getEngineeringFirms = () => [
  { name: 'Provost and Pritchard', url: 'https://provostandpritchard.com/' }
];

export default function OutputsDataSection({ formData }) {
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
                <td>
                  {formatQty(output.quantity)} {output.quantity_unit}
                </td>
                <td>
                  {toPrice(output.unit_cost)}
                  {formatUnits(output.unit_cost_units)}
                </td>
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
                  <li key={firm.name}>
                    <a href={firm.url} target="_blank" rel="noreferrer">
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
