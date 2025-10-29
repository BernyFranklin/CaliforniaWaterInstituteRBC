export default function InputField({ field, value, onChange }) {
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
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
