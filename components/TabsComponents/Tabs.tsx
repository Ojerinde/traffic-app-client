interface TabsProps {
  currentStep: number;
  onChangeTab: (step: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ currentStep, onChangeTab }) => {
  const tabs = [
    { step: 1, value: "Phases" },
    { step: 2, value: "Patterns" },
    { step: 3, value: "Time Segments" },
    { step: 4, value: "Segment Plan" },
  ];

  return (
    <ul className="tabs__list">
      {tabs.map((tab) => (
        <li
          className={`tabs__item ${
            currentStep === tab.step && "tabs__item--active"
          }`}
          key={tab.step}
          onClick={() => onChangeTab(tab.step)}
        >
          {/* <p>{tab.step}</p> */}
          {/* {currentStep === tab.step && <span>{tab.value}</span>} */}
          <span>{tab.value}</span>
        </li>
      ))}
    </ul>
  );
};
export default Tabs;
