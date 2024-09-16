import { ChangeEvent, useState } from "react";
import CheckBox from "../UI/CheckBox/CheckBox";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHook";
import {
  allowConflictConfig,
  clearSignalString,
  setSignalState,
  setSignalString,
} from "@/store/signals/SignalConfigSlice";
import { emitToastMessage } from "@/utils/toastFunc";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import HttpRequest from "@/store/services/HttpRequest";
import { getUserPhase } from "@/store/devices/UserDeviceSlice";

interface BoxOneProps {}
const BoxOne: React.FC<BoxOneProps> = ({}) => {
  const [checked, setChecked] = useState<number>(1);
  const { phases } = useAppSelector((state) => state.userDevice);
  const dispatch = useAppDispatch();

  // Function to handle selecting a phase to update Intersection UI
  const handleSelectPhase = (phaseName: string, signalString: string) => {
    dispatch(setSignalString(signalString));
    dispatch(setSignalState());
  };

  // Function to delete a phase
  const handleDeletePhase = async (phaseName: string) => {
    const confirmResult = confirm(
      "Are you sure you want to delete this phase?"
    );

    if (!confirmResult) return;
    const phase = phases.find((p) => p.name === phaseName);
    const phaseId = phase?._id;

    try {
      const email = GetItemFromLocalStorage("user").email;
      const { data } = await HttpRequest.delete(`/phases/${phaseId}/${email}`);
      emitToastMessage(data.message, "success");
      dispatch(getUserPhase(email));
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
    }
  };
  return (
    <div className="boxOne">
      {phases.length > 0 ? (
        <ul className="phases">
          <h2 className="phases__header">Available Phase(s)</h2>
          {phases.map((phase, index) => (
            <li className="phases--item" key={index}>
              <h3>{phase.name}</h3>
              <div>
                <button
                  onClick={() => handleSelectPhase(phase.name, phase.data)}
                >
                  Preview
                </button>
                <button onClick={() => handleDeletePhase(phase.name)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="phases__noPhase">
          You have not created any phase yet.
        </div>
      )}
      <CheckBox
        name="liability"
        checked={checked}
        description={`${
          !checked
            ? "Conflicts Check is Disabled"
            : "Conflicts Check is Enabled"
        } `}
        onChecked={(e: ChangeEvent<HTMLInputElement>) => {
          if (!e.target.checked) {
            const resp = confirm(
              "I understand the potential conflict and accept liability."
            );
            if (!resp) return;
            dispatch(allowConflictConfig(true));
            emitToastMessage("Conflict check is disabled", "success");
            return setChecked(0);
          }
          setChecked(1);
          dispatch(clearSignalString());
          dispatch(setSignalState());
          dispatch(allowConflictConfig(false));
          emitToastMessage("Signal configuration cleared", "success");
        }}
      />
      {phases.length == 0 ? (
        <p>
          To create a phase, configure each signal by toggling the corresponding
          lights. If a potential conflict arises, you will receive a
          notification. If you choose to proceed despite the conflict, you can
          confirm by selecting the checkbox above. <strong>Note:</strong> You
          are responsible for any accidents resulting from the conflict. If the
          checkbox is unchecked at any point, your current configuration will be
          discarded.
        </p>
      ) : (
        <div>
          <p>
            Add a new phase by configuring each signal, then click the add icon
            at the center of the intersection to enter the phase name.
          </p>
          <button
            className="phases__clear"
            onClick={() => {
              dispatch(clearSignalString());
              dispatch(setSignalState());
            }}
          >
            Clear UI Configuration
          </button>
        </div>
      )}

      {phases.length == 0 && (
        <p>
          Once you have completed the signal configuration, click on the add
          icon at the center of the intersection. You will be prompted to enter
          a name for the phase before submitting.
        </p>
      )}
    </div>
  );
};
export default BoxOne;
