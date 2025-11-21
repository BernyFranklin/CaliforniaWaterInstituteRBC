import CalculationDataSection from '../CalculationDataSection.jsx';
import OutputsDataSection from '../OutputsDataSection.jsx';
import ReturnOnInvestmentTable from '../ReturnOnInvestmentTable.jsx';

export default function RoiResults({ formData }) {
  const styles = {
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
      <div className="roi-results" id="roi-results-section" style={styles.container}>
        <CalculationDataSection formData={formData} />
        <OutputsDataSection formData={formData} />
        <ReturnOnInvestmentTable formData={formData} />
      </div>
    </>
  );
}
