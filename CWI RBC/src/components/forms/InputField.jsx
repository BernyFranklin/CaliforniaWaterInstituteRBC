import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function InputField({ field, value, onChange, sanitizeValue }) {
  const { id, text, type = 'text', min, max, step, options, infoText } = field;

  // Local styles to decouple from App.css label/input/select rules
  const styles = {
    group: {
      display: 'flex',
      flexDirection: 'column',
      width: '30%', // Force consistent width for all field groups
    },
    label: {
      fontFamily: 'inherit',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginBottom: '0.25rem',
      gap: '0.5rem',
    },
    control: {
      fontFamily: 'inherit',
      fontSize: '1.25rem',
      color: '#333',
      display: 'block',
      width: '100%',
      backgroundColor: '#ddd',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '0.5rem',
      boxSizing: 'border-box',
    },
    infoIcon: {
      color: '#193565',
      cursor: 'help',
      fontSize: '1rem',
      position: 'relative',
    },
    tooltip: {
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#333',
      color: 'white',
      padding: '0.5rem',
      borderRadius: '4px',
      fontSize: '0.875rem',
      whiteSpace: 'nowrap',
      minWidth: '400px',
      whiteSpace: 'normal',
      zIndex: 1000,
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 0.3s, visibility 0.3s',
      marginBottom: '5px',
    },
    iconWrapper: {
      position: 'relative',
      display: 'inline-block',
    },
  };

  if (type === 'select') {
    return (
      <div className="input-group" style={styles.group}>
        <label htmlFor={id} style={styles.label}>
          {text}
          {infoText && (
            <span 
              style={styles.iconWrapper}
              onMouseEnter={(e) => {
                const tooltip = e.currentTarget.querySelector('.tooltip');
                if (tooltip) {
                  tooltip.style.opacity = '1';
                  tooltip.style.visibility = 'visible';
                }
              }}
              onMouseLeave={(e) => {
                const tooltip = e.currentTarget.querySelector('.tooltip');
                if (tooltip) {
                  tooltip.style.opacity = '0';
                  tooltip.style.visibility = 'hidden';
                }
              }}
            >
              <FontAwesomeIcon 
                icon="fa-solid fa-circle-info" 
                style={styles.infoIcon}
              />
              <div className="tooltip" style={styles.tooltip}>
                {infoText}
              </div>
            </span>
          )}
        </label>
        <select id={id} name={id} value={value} onChange={onChange} style={styles.control}>
          <option value="" disabled>
            Select {text.toLowerCase()}
          </option>
          {Array.isArray(options) &&
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.text}
              </option>
            ))}
        </select>
      </div>
    );
  }

  const handleBlur = (e) => {
    if (typeof sanitizeValue !== 'function') return;
    // Only sanitize numeric inputs; selects/others can skip
    if (type !== 'number') return;
    const sanitized = sanitizeValue(id, e.target.value);
    if (sanitized !== e.target.value) {
      onChange({ target: { name: id, value: sanitized } });
    }
  };

  return (
    <div className="input-group" style={styles.group}>
      <label htmlFor={id} style={styles.label}>
        {text}
        {infoText && (
          <span 
            style={styles.iconWrapper}
            onMouseEnter={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip');
              if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
              }
            }}
            onMouseLeave={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip');
              if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
              }
            }}
          >
            <FontAwesomeIcon 
              icon="fa-solid fa-circle-info" 
              style={styles.infoIcon}
            />
            <div className="tooltip" style={styles.tooltip}>
              {infoText}
            </div>
          </span>
        )}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        min={min}
        max={max}
        step={step}
        placeholder={field.placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        style={styles.control}
      />
    </div>
  );
}
