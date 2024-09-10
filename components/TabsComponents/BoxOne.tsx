import { ChangeEvent, useState } from "react";
import CheckBox from "../UI/CheckBox/CheckBox";
import { useAppDispatch } from "@/hooks/reduxHook";
import {
  allowConflictConfig,
  clearSignalString,
  setSignalState,
} from "@/store/signals/SignalConfigSlice";
import { emitToastMessage } from "@/utils/toastFunc";

interface BoxOneProps {}
const BoxOne: React.FC<BoxOneProps> = ({}) => {
  const [checked, setChecked] = useState<number>(0);
  const dispatch = useAppDispatch();
  return (
    <div className="boxOne">
      <p>
        To create a phase, configure each signal by toggling the corresponding
        lights. If a potential conflict arises, you will receive a notification.
        If you choose to proceed despite the conflict, you can confirm by
        selecting the checkbox below. <strong>Note:</strong> You are responsible
        for any accidents resulting from the conflict. If the checkbox is
        unchecked at any point, your current configuration will be discarded.
      </p>
      <CheckBox
        name="liability"
        checked={checked}
        description="I understand the potential conflict and accept liability."
        onChecked={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.checked) {
            dispatch(allowConflictConfig(true));
            emitToastMessage("Conflict check is disabled", "success");
            return setChecked(1);
          }
          setChecked(0);
          dispatch(clearSignalString());
          dispatch(setSignalState());
          dispatch(allowConflictConfig(false));
          emitToastMessage("Signal configuration cleared", "success");
        }}
      />
      <p>
        Once you have completed the signal configuration, click on the add icon
        at the center of the intersection. You will be prompted to enter a name
        for the phase before submitting.
      </p>
    </div>
  );
};
export default BoxOne;
