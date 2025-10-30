import InputField from './InputField.jsx';

export default function FormSection({ legend, fields, formData, onChange, sanitizeValue }) {
  const styles = {
    fieldset: {
      borderRadius: '5px',
      border: '3px solid #ccc',
      padding: '0 2rem 2rem 2rem',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '2rem',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    legend: {
      fontFamily: 'inherit',
      fontSize: '1.5rem',
      padding: '0.5rem',
    },
  };
  return (
    <fieldset className="form-fieldset" style={styles.fieldset}>
      <legend className="fieldset-label" style={styles.legend}>{legend}</legend>
      {fields.map((field) => (
        <InputField
          key={field.id}
          field={field}
          value={formData[field.id]}
          onChange={onChange}
          sanitizeValue={sanitizeValue}
        />
      ))}
    </fieldset>
  );
}
