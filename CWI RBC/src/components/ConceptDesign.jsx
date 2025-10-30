export default function ConceptDesign() {
  const styles = {
    container: {
      // Moved from App.css (#concept-design-section + .has-shadow)
      backgroundColor: '#fff',
      color: '#000',
      padding: '3rem',
      textAlign: 'center',
      margin: 0,
      height: '100vh', // Change later if needed
      boxShadow: 'black 0px 0px 10px -1px',
    },
  };

  return (
    <div id="concept-design-section" style={styles.container}>
      <h2>Concept Design Placeholder</h2>
    </div>
  );
}