import Button from '../Button.jsx';

export default function ButtonBar({ formContent, setFormContent, contents, onReset }) {
  
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
  };

  const backButtonColor = formContent === 0 ? 'gray-button' : 'red-button';
  const lastSectionIndex = contents.length - 1;

  function NextOrSubmitButton() {
    const buttonText = formContent === lastSectionIndex - 1 ? 'Submit' : 'Next';
    return <Button className="red-button" text={buttonText} />;
  }

  const handleBackClick = () => {
    formContent > 0 ? setFormContent(formContent - 1) : setFormContent(formContent);
  };

  const handleSubmitClick = () => {
    setFormContent(lastSectionIndex);
  };

  const handleNextClick = () => {
    formContent < lastSectionIndex - 1 ? setFormContent(formContent + 1) : handleSubmitClick();
  };

  return (
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
  );
}
