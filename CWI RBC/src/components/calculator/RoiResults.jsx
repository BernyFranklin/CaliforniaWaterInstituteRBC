import CalculationDataSection from '../CalculationDataSection.jsx';
import OutputsDataSection from '../OutputsDataSection.jsx';
import ReturnOnInvestmentTable from '../ReturnOnInvestmentTable.jsx';

export default function RoiResults({ formData }) {
  return (
    <>
      <h2 className="results-header">Results</h2>
      <div className="roi-results" id="roi-results-section">
        <CalculationDataSection formData={formData} />
        <OutputsDataSection formData={formData} />
        <ReturnOnInvestmentTable formData={formData} />
      </div>
    </>
  );
}
