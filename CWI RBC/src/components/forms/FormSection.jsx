import InputField from './InputField.jsx';

export default function FormSection({ legend, fields, formData, onChange, sanitizeValue }) {
  return (
    <fieldset className="form-fieldset">
      <legend className="fieldset-label">{legend}</legend>
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
