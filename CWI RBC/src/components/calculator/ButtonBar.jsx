import Button from '../Button.jsx';

export default function ButtonBar({ formContent, setFormContent, contents, onReset }) {
  const backButtonColor = formContent === 0 ? 'gray-button' : 'red-button';

  // Local inline styles to remove dependence on App.css for layout
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

  function NextOrSubmitButton() {
    const buttonText = formContent === contents.length - 2 ? 'Submit' : 'Next';
    return <Button className="red-button" text={buttonText} />;
  }

  const handleBackClick = () => {
    formContent > 0 ? setFormContent(formContent - 1) : setFormContent(formContent);
  };

  const handleSubmitClick = () => {
    setFormContent(4);
  };

  const handleNextClick = () => {
    formContent < contents.length - 2 ? setFormContent(formContent + 1) : handleSubmitClick();
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
      {formContent !== 4 && (
        <span className="button-bar-right" style={styles.right}>
          <a onClick={handleNextClick}>
            <NextOrSubmitButton />
          </a>
        </span>
      )}
    </div>
  );
}
