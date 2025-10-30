export default function InputField({ field, value, onChange, sanitizeValue }) {
  const { id, text, type = 'text', min, max, step, options } = field;

  // Local styles to decouple from App.css label/input/select rules
  const styles = {
    group: {},
    label: {
      fontFamily: 'inherit',
      display: 'block',
      width: '30%',
      minWidth: '250px',
    },
    control: {
      fontFamily: 'inherit',
      fontSize: '1.25rem',
      color: '#333',
      display: 'block',
      width: '30%',
      minWidth: '250px',
      backgroundColor: '#ddd',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '0.5rem',
    },
  };

  if (type === 'select') {
    return (
      <div className="input-group" style={styles.group}>
        <label htmlFor={id} style={styles.label}>{text}</label>
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
      <label htmlFor={id} style={styles.label}>{text}</label>
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
