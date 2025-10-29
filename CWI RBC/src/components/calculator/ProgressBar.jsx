export default function ProgressBar({ current }) {
  const sections = [
    { index: 0, id: 'progress-bar-left', text: 'Basin Size and Design' },
    { index: 1, id: 'progress-bar-center-left', text: 'Water Availability' },
    { index: 2, id: 'progress-bar-center-right', text: 'Development Costs' },
    { index: 3, id: 'progress-bar-right', text: 'Water Costs' },
  ];

  const sectionColor = (index) => (index <= current ? 'progress-bar-fill' : 'progress-bar-empty');

  return (
    <div id="progress-bar" className="progress-bar-container">
      {sections.map((section) => (
        <span className={`progress-bar ${sectionColor(section.index)}`} id={section.id} key={section.id}>
          {section.text}
        </span>
      ))}
    </div>
  );
}
