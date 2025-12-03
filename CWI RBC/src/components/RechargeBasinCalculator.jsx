import { useState, useCallback } from 'react';
import Button from './Button.jsx';
import CalculatorHeader from './calculator/CalculatorHeader.jsx';
import ProgressBar from './calculator/ProgressBar.jsx';
import AreaOfInterest from './AreaOfInterest.jsx';
import ButtonBar from './calculator/ButtonBar.jsx';
import RoiResults from './calculator/RoiResults.jsx';
import FormSection from './forms/FormSection.jsx';
import { usePersistentState } from '../utils/hooks/usePersistentState.js';
import { defaultFormData } from '../utils/form/defaultFormData.js';
import { sections, soilOptions } from '../utils/form/sectionsSchema.js';
import { sanitizeValue, validateSection, getSectionIdByIndex } from '../utils/form/validate.js';


function BasinSizeAndDesign({ formData, handleChange, onSanitize }) {
  const { legend, fields } = sections.basinSizeAndDesign;
  return (
    <FormSection legend={legend} fields={fields} formData={formData} onChange={handleChange} sanitizeValue={onSanitize} />
  );
}

function WaterAvailability({ formData, handleChange, onSanitize }) {
  const { legend, fields } = sections.waterAvailability;
  return (
    <FormSection legend={legend} fields={fields} formData={formData} onChange={handleChange} sanitizeValue={onSanitize} />
  );
}

function DevelopmentCosts({ formData, handleChange, onSanitize }) {
  const { legend, fields } = sections.developmentCosts;
  return (
    <FormSection legend={legend} fields={fields} formData={formData} onChange={handleChange} sanitizeValue={onSanitize} />
  );
}

function WaterCosts({ formData, handleChange, onSanitize }) {
  const { legend, fields } = sections.waterCosts;
  return (
    <FormSection legend={legend} fields={fields} formData={formData} onChange={handleChange} sanitizeValue={onSanitize} />
  );
}



export default function RechargeBasinCalculator() {
  const [formContent, setFormContent] = useState(0);
  const [formData, setFormData] = usePersistentState('formData', defaultFormData);
  const styles = {
    container: {
      boxShadow: 'black 0px 0px 10px -1px',
      margin: 0,
      backgroundColor: '#fff',
      color: '#000',
      padding: '3rem',
    },
  };
  
  const handleChange = useCallback((e) => {
    let { name, value } = e.target;
    
    // Handle soil_type selection and auto-populate infiltration_rate
    if (name === "soil_type") {
      const selectedSoil = soilOptions.find(soil => soil.value === value);
      
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        // Auto-populate infiltration rate if soil type is found
        ...(selectedSoil && { infiltration_rate: selectedSoil.infiltrationRate })
      }));
      return;
    }
    
    // Prevents error when input is cleared
    value = (value === '') ? '' : parseFloat(value);
    // Sets state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }, [setFormData])
  
  const handleSanitize = useCallback((fieldId, rawValue) => sanitizeValue(fieldId, rawValue), []);

  const handleReset = useCallback(() => {
    try {
      localStorage.removeItem('formData');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    // Reset form data and step index
    setFormData({ ...defaultFormData });
    setFormContent(0);
  }, [setFormData]);
  
  const contents = [
    <AreaOfInterest formData={formData} setFormData={setFormData} />,
    <BasinSizeAndDesign formData={formData} handleChange={handleChange} onSanitize={handleSanitize} />, 
    <WaterAvailability  formData={formData} handleChange={handleChange} onSanitize={handleSanitize} />, 
    <DevelopmentCosts   formData={formData} handleChange={handleChange} onSanitize={handleSanitize} />, 
    <WaterCosts         formData={formData} handleChange={handleChange} onSanitize={handleSanitize} />, 
    <RoiResults         formData={formData}/>
  ]

  // Validation function to check if current section is complete
  const validateCurrentSection = useCallback((currentIndex) => {
    if (currentIndex === 0) return { isValid: true, missingFields: [] }; // AreaOfInterest doesn't need validation
    if (currentIndex === 5) return { isValid: true, missingFields: [] }; // Results page doesn't need validation (index 5 is last)
    
    const sectionId = getSectionIdByIndex(currentIndex);
    return validateSection(sectionId, formData);
  }, [formData]);

  return (
    <section id="calculator-section" style={styles.container}>
      <CalculatorHeader />
      <ProgressBar current={formContent} />
      <div id="calculator-form">
        <form>
          { contents[formContent] }
        </form>
        <ButtonBar 
          formContent={formContent} 
          setFormContent={setFormContent}
          contents={contents}
          onReset={handleReset}
          validateCurrentSection={validateCurrentSection}
        />
      </div>
    </section>
  )
}