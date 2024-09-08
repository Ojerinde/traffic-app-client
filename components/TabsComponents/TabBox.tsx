import BoxOne from "./BoxOne";
import BoxThree from "./BoxThree";
import BoxTwo from "./BoxTwo";

interface TabBoxProps {
  currentStep: number;
}
const TabBox: React.FC<TabBoxProps> = ({ currentStep }) => {
  return (
    <div>
      {currentStep === 1 && <BoxOne />}
      {currentStep === 2 && <BoxTwo />}
      {currentStep === 3 && <BoxThree />}
      {currentStep === 4 && <div>Box 4</div>}
      {currentStep === 5 && <div>Box 5</div>}
    </div>
  );
};
export default TabBox;
