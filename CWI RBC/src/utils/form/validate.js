import { findFieldById, sections } from './sectionsSchema.js';

// Sanitize and clamp an input value based on field schema
export function sanitizeValue(fieldId, rawValue) {
  const field = findFieldById(fieldId);
  if (!field) return rawValue; // Unknown field; no-op

  // Selects just pass through raw value
  if (field.type === 'select') {
    return rawValue;
  }

  // Empty string stays empty (allows clearing input without turning into NaN)
  if (rawValue === '') return '';

  // Ensure number for numeric fields
  let num = typeof rawValue === 'number' ? rawValue : parseFloat(rawValue);
  if (Number.isNaN(num)) return '';

  // Clamp to min/max when provided
  if (typeof field.min === 'number') {
    num = Math.max(field.min, num);
  }
  if (typeof field.max === 'number') {
    num = Math.min(field.max, num);
  }

  // Respect step if provided by rounding to nearest step increment from min or 0
  if (typeof field.step === 'number' && field.step > 0) {
    const base = typeof field.min === 'number' ? field.min : 0;
    const steps = Math.round((num - base) / field.step);
    num = base + steps * field.step;
    // Avoid negative zero artifacts
    if (Object.is(num, -0)) num = 0;
    // Normalize floating rounding
    num = parseFloat(num.toFixed(10));
  }

  return num;
}

// Validate if all required fields in a section are filled
export function validateSection(sectionId, formData) {
  const section = sections[sectionId];
  if (!section) return { isValid: true, missingFields: [] };

  const missingFields = [];
  
  for (const field of section.fields) {
    const value = formData[field.id];
    
    // Check if field is empty or undefined
    if (value === '' || value === null || value === undefined) {
      missingFields.push({
        id: field.id,
        text: field.text
      });
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

// Get section ID by index for validation
export function getSectionIdByIndex(index) {
  const sectionKeys = ['basinSizeAndDesign', 'waterAvailability', 'developmentCosts', 'waterCosts'];
  return sectionKeys[index - 1]; // index 0 is AreaOfInterest, not a form section
}
