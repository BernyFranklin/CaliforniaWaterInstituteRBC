import CalculationDataSection from '../CalculationDataSection.jsx';
import OutputsDataSection from '../OutputsDataSection.jsx';
import ReturnOnInvestmentTable from '../ReturnOnInvestmentTable.jsx';

export default function RoiResults({ formData }) {
  const styles = {
    header: {
      fontFamily: 'inherit',
      fontWeight: 500,
      padding: '1.5rem',
      textAlign: 'center',
    },
    container: {
      fontFamily: 'inherit',
      backgroundColor: '#fff',
      color: '#000',
      padding: '0 1rem',
      textAlign: 'center',
      margin: 0,
      minHeight: '100vh',
    },
  };
  return (
    <>
      <h2 className="results-header" style={styles.header}>Results</h2>
      <div className="roi-results" id="roi-results-section" style={styles.container}>
        <CalculationDataSection formData={formData} />
        <OutputsDataSection formData={formData} />
        <ReturnOnInvestmentTable formData={formData} />
      </div>
    </>
  );
}
