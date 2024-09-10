import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHook";
import {
  setSignalState,
  setSignalString,
} from "@/store/signals/SignalConfigSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";
import { getUserPattern, getUserPhase } from "@/store/devices/UserDeviceSlice";

interface NewPatternProps {}

const NewPattern: React.FC<NewPatternProps> = ({}) => {
  const { phases } = useAppSelector((state) => state.userDevice);
  const dispatch = useAppDispatch();
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
  const [patternName, setPatternName] = useState<string>("");

  // Function to handle selecting a phase to update Intersection UI
  const handleSelectPhase = (phaseName: string, signalString: string) => {
    dispatch(setSignalString(signalString));
    dispatch(setSignalState());
  };

  // Function to handle adding/removing a phase
  const handleAddRemovePhase = (phaseName: string) => {
    setSelectedPhases((prev) =>
      prev.includes(phaseName)
        ? prev.filter((p) => p !== phaseName)
        : [...prev, phaseName]
    );
  };
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

  // Handle Drag and Drop (reordering)
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedPhases = [...selectedPhases];
    const [removed] = reorderedPhases.splice(result.source.index, 1);
    reorderedPhases.splice(result.destination.index, 0, removed);
    setSelectedPhases(reorderedPhases);
  };

  const handleCreatePattern = async () => {
    const selectedPhasesId = phases
      .map((phase) => (selectedPhases.includes(phase.name) ? phase : null))
      .filter(Boolean)
      .map((phase) => phase._id);
    console.log("Selected phases data", patternName, selectedPhasesId);
    try {
      const email = GetItemFromLocalStorage("user").email;
      const { data } = await HttpRequest.post("/patterns", {
        patternName,
        email: email,
        selectedPhases: selectedPhasesId,
      });
      emitToastMessage(data.message, "success");
      setPatternName("");
      dispatch(getUserPattern(email));
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
      console.log("Error", error);
    }
  };

  return (
    <div className="newPattern">
      <h2 className="newPattern__header">Select phases for the new pattern</h2>
      <ul className="newPattern__phases">
        {phases.map((phase) => (
          <li className="newPattern__phases--item" key={phase.name}>
            <h3>{phase.name}</h3>
            <div>
              <button onClick={() => handleSelectPhase(phase.name, phase.data)}>
                Preview
              </button>
              <button onClick={() => handleAddRemovePhase(phase.name)}>
                {selectedPhases.includes(phase.name) ? "Remove" : "Add"}
              </button>
              <button onClick={() => handleDeletePhase(phase.name)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {selectedPhases.length > 0 && (
        <div className="newPattern__selected">
          <p>
            Below are the phases you have selected. you can reorder by drag and
            drop. <span onClick={() => setSelectedPhases([])}>Clear all</span>
          </p>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="selected-phases">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {selectedPhases.map((phase, index) => (
                    <Draggable key={phase} draggableId={phase} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {phase}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <div className="newPattern__selected--ctn">
            <input
              type="text"
              name="pattern"
              value={patternName}
              onChange={(e) => setPatternName(e.target.value)}
              placeholder="Enter pattern name"
            />
            <button type="button" onClick={handleCreatePattern}>
              Create Pattern
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPattern;
