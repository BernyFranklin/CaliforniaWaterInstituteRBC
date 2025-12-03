import Button from '../Button.jsx';

import { useState } from 'react';

export default function ButtonBar({ formContent, navigate, sectionMap, contents, onReset, validateCurrentSection }) {
  const [validationError, setValidationError] = useState(null);
  
  // Reverse mapping for navigation
  const sectionNames = Object.keys(sectionMap);
  
  const navigateToSection = (sectionIndex) => {
    const sectionName = sectionNames[sectionIndex];
    if (sectionName) {
      navigate(`/calculator/${sectionName}`);
    }
  };
  
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      paddingTop: '3rem',
    },
    left: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '0.5rem',
      gap: '0.5rem',
    },
    center: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem',
    },
    right: {
      display: 'flex',
      alignItems: 'flex-end',
      padding: '0.5rem',
    },
    validationError: {
      color: '#d32f2f',
      fontSize: '0.9rem',
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#ffebee',
      border: '1px solid #ffcdd2',
      borderRadius: '4px',
    },
    missingFieldsList: {
      margin: '0.5rem 0 0 1rem',
      listStyleType: 'bullet',
    },
  };

  const backButtonColor = formContent === 0 ? 'gray-button' : 'red-button';
  const lastSectionIndex = contents.length - 1;

  function NextOrSubmitButton() {
    const buttonText = formContent === lastSectionIndex - 1 ? 'Submit' : 'Next';
    return <Button className="red-button" text={buttonText} />;
  }

  const handleBackClick = () => {
    setValidationError(null); // Clear validation error when going back
    if (formContent > 0) {
      navigateToSection(formContent - 1);
    }
  };

  const handleSubmitClick = () => {
    setValidationError(null); // Clear validation error when submitting
    navigateToSection(lastSectionIndex);
  };

  const handleNextClick = () => {
    setValidationError(null);
    
    // Validate current section before proceeding
    const validation = validateCurrentSection(formContent);
    
    if (!validation.isValid) {
      setValidationError({
        message: 'Please fill in all required fields before proceeding:',
        missingFields: validation.missingFields
      });
      return;
    }
    
    if (formContent < lastSectionIndex - 1) {
      navigateToSection(formContent + 1);
    } else {
      handleSubmitClick();
    }
  };

  return (
    <>
      {validationError && (
        <div style={styles.validationError}>
          <strong>{validationError.message}</strong>
          <ul style={styles.missingFieldsList}>
            {validationError.missingFields.map(field => (
              <li key={field.id}>{field.text}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="button-bar" style={styles.container}>
      <span className="button-bar-left" style={styles.left}>
        <a onClick={handleBackClick}>
          <Button className={`${backButtonColor}`} text="Back" />
        </a>
      </span>
      <span className="button-bar-center" style={styles.center}>
        {typeof onReset === 'function' && (
          <a onClick={onReset}>
            <Button className="red-button" text="Reset" />
          </a>
        )}
      </span>
      {formContent !== lastSectionIndex && (
        <span className="button-bar-right" style={styles.right}>
          <a onClick={handleNextClick}>
            <NextOrSubmitButton />
          </a>
        </span>
      )}
      </div>
    </>
  );
}
