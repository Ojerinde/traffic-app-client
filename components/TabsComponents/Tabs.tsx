interface TabsProps {
  currentStep: number;
  onChangeTab: (step: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ currentStep, onChangeTab }) => {
  const tabs = [
    { step: 1, value: "Add Phase" },
    { step: 2, value: "Create Pattern" },
    { step: 3, value: "Group Patterns" }, // Multiple pattern will be selected, time will be set for each phase in a pattern
    { step: 4, value: "Schedule" }, // Schedule will be created for each day of the week
    { step: 5, value: "Plan" }, // Plan will be created for each day of the
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
          <p>{tab.step}</p>
          {currentStep === tab.step && <span>{tab.value}</span>}
        </li>
      ))}
    </ul>
  );
};
export default Tabs;
