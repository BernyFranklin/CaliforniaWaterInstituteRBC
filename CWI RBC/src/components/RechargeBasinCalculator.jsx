import { useState, useCallback } from 'react';
import Button from './Button.jsx';
import CalculatorHeader from './calculator/CalculatorHeader.jsx';
import ProgressBar from './calculator/ProgressBar.jsx';
import ButtonBar from './calculator/ButtonBar.jsx';
import RoiResults from './calculator/RoiResults.jsx';
import FormSection from './forms/FormSection.jsx';
import { usePersistentState } from '../utils/hooks/usePersistentState.js';
import { defaultFormData } from '../utils/form/defaultFormData.js';
import { sections } from '../utils/form/sectionsSchema.js';
import { sanitizeValue } from '../utils/form/validate.js';


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
    // Don't parse soil_type since it's a string
    if (name === "soil_type") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
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
    } catch (e) {
      // ignore storage errors
    }
    // Reset form data and step index
    setFormData({ ...defaultFormData });
    setFormContent(0);
  }, [setFormData]);
  
  const contents = [
    <BasinSizeAndDesign formData={formData} handleChange={handleChange} onSanitize={handleSanitize} />, 
    <WaterAvailability  formData={formData} handleChange={handleChange} onSanitize={handleSanitize} />, 
    <DevelopmentCosts   formData={formData} handleChange={handleChange} onSanitize={handleSanitize} />, 
    <WaterCosts         formData={formData} handleChange={handleChange} onSanitize={handleSanitize} />, 
    <RoiResults         formData={formData}/>
  ]

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
        />
      </div>
    </section>
  )
}