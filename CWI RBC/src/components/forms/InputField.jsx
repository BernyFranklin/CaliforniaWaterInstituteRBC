export default function InputField({ field, value, onChange, sanitizeValue }) {
  const { id, text, type = 'text', min, max, step, options } = field;

  if (type === 'select') {
    return (
      <div className="input-group">
        <label htmlFor={id}>{text}</label>
        <select id={id} name={id} value={value} onChange={onChange}>
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
    <div className="input-group">
      <label htmlFor={id}>{text}</label>
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
      />
    </div>
  );
}
