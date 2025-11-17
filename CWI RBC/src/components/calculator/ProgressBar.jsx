export default function ProgressBar({ current }) {
  const sections = [
    { index: 0, id: 'progress-bar-left', text: 'Area of Interest' },
    { index: 1, id: 'progress-bar-center', text: 'Basin Size and Design' },
    { index: 1, id: 'progress-bar-center', text: 'Water Availability' },
    { index: 2, id: 'progress-bar-center', text: 'Development Costs' },
    { index: 3, id: 'progress-bar-right', text: 'Water Costs' },
  ];

  const sectionColor = (index) => (index <= current ? 'progress-bar-fill' : 'progress-bar-empty');

  // Local inline styles to decouple from App.css
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      gap: '3px',
      padding: '1rem 2rem',
      backgroundColor: '#fff',
    },
    spanBase: {
      boxSizing: 'border-box',
      border: '1px solid #ccc',
      flex: 1,
      minWidth: 0,
      display: 'flex',
      justifyContent: 'center',
      padding: '0.5rem',
      textAlign: 'center',
      alignItems: 'center',
      lineHeight: '20px',
    },
    left: { borderRadius: '10px 0 0 10px' },
    right: { borderRadius: '0 10px 10px 0' },
    fill: { backgroundColor: '#193565', color: '#fff' },
    empty: { backgroundColor: '#ced1d4' },
  };

  return (
    <div id="progress-bar" className="progress-bar-container" style={styles.container}>
      {sections.map((section) => {
        const isFirst = section.index === 0;
        const isLast = section.index === sections.length - 1;
        const variant = sectionColor(section.index);
        const variantStyle = variant === 'progress-bar-fill' ? styles.fill : styles.empty;
        const edgeStyle = isFirst ? styles.left : isLast ? styles.right : {};
        return (
          <span
            className={`progress-bar ${variant}`}
            id={section.id}
            key={section.id}
            style={{ ...styles.spanBase, ...edgeStyle, ...variantStyle }}
          >
            {section.text}
          </span>
        );
      })}
    </div>
  );
}
