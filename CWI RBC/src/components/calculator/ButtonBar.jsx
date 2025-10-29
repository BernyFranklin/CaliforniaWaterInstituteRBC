import Button from '../Button.jsx';

export default function ButtonBar({ formContent, setFormContent, contents, onReset }) {
  const backButtonColor = formContent === 0 ? 'gray-button' : 'red-button';

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
    <div className="button-bar">
      <span className="button-bar-left">
        <a onClick={handleBackClick}>
          <Button className={`${backButtonColor}`} text="Back" />
        </a>
      </span>
      <span className="button-bar-center">
        {typeof onReset === 'function' && (
          <a onClick={onReset}>
            <Button className="red-button" text="Reset" />
          </a>
        )}
      </span>
      {formContent !== 4 && (
        <span className="button-bar-right">
          <a onClick={handleNextClick}>
            <NextOrSubmitButton />
          </a>
        </span>
      )}
    </div>
  );
}
