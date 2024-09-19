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
import { getUserPattern } from "@/store/devices/UserDeviceSlice";
import Button from "../UI/Button/Button";

interface BoxTwoProps {}

const BoxTwo: React.FC<BoxTwoProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { phases, patterns } = useAppSelector((state) => state.userDevice);
  const [showAllAvailablePhases, setShowAllAvailablePhases] =
    useState<boolean>(false);

  const [showPatternPhases, setShowPatternPhases] = useState<number | null>(
    null
  );
  const [selectedPattern, setSelectedPattern] = useState<{
    name: string;
    phases: any[];
  } | null>(null);

  const [patternPhaseIsEditable, setPatternPhaseIsEditable] =
    useState<boolean>(false);
  const [updatedPatternPhases, setUpdatedPatternPhases] = useState<any[]>([]);

  // Logic for adding new pattern
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
  const [patternName, setPatternName] = useState<string>("");

  const handleSelectPattern = (pattern: any, index: number) => {
    if (showPatternPhases === index) {
      setShowPatternPhases(null);
      setSelectedPattern(null);
    } else {
      setShowPatternPhases(index);
      setSelectedPattern(pattern);
      setUpdatedPatternPhases(pattern.phases);
    }
  };
  const handleDeletePattern = async (patternName: string) => {
    const confirmResult = confirm(
      "Are you sure you want to delete this pattern?"
    );
    if (!confirmResult) return;
    const pattern = patterns.find((p) => p.name === patternName);
    const patternId = pattern?._id;
    console.log("Pattern ID", pattern, patternName, patternId);

    try {
      const email = GetItemFromLocalStorage("user").email;
      const { data } = await HttpRequest.delete(
        `/patterns/${patternId}/${email}`
      );
      emitToastMessage(data.message, "success");
      dispatch(getUserPattern(email));
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
    }
  };

  // Logic to edit a phase
  const handleRemovePhase = (phaseId: string) => {
    const updatedPhases = updatedPatternPhases.filter(
      (phase) => phase._id !== phaseId
    );
    setUpdatedPatternPhases(updatedPhases);
  };

  const editPatternHandler = async () => {
    console.log("Saving updated phases:", updatedPatternPhases);
    // Implement backend call here
  };

  const handleDragEndEdit = (result: any) => {
    if (!result.destination) return;
    const reorderedPhases = [...updatedPatternPhases];
    const [removed] = reorderedPhases.splice(result.source.index, 1);
    reorderedPhases.splice(result.destination.index, 0, removed);
    setUpdatedPatternPhases(reorderedPhases);
  };

  // Logic for creating a new pattern
  // Handle selecting/unselecting a phase (Add/Remove)
  const handlePhaseSelect = (phaseName: string) => {
    setSelectedPhases((prevSelectedPhases) => {
      if (prevSelectedPhases.includes(phaseName)) {
        // Remove the phase if it's already selected
        return prevSelectedPhases.filter((id) => id !== phaseName);
      } else {
        // Add the phase if it's not selected
        return [...prevSelectedPhases, phaseName];
      }
    });
  };
  const handleDragEndCreate = (result: any) => {
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
    try {
      const email = GetItemFromLocalStorage("user").email;
      const { data } = await HttpRequest.post("/patterns", {
        patternName,
        email: email,
        selectedPhases: selectedPhasesId,
      });
      emitToastMessage(data.message, "success");
      setPatternName("");
      setSelectedPhases([]);
      dispatch(getUserPattern(email));
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
      console.log("Error", error);
    }
  };

  // For previewing phase
  const handlePhasePreview = (phaseSignalString: string) => {
    dispatch(setSignalString(phaseSignalString));
    dispatch(setSignalState());
  };

  return (
    <div className="boxTwo">
      {/* Logic to add a new pattern */}
      <button
        className="patterns__new"
        onClick={() => setShowAllAvailablePhases((prev) => !prev)}
      >
        {!showAllAvailablePhases ? "Add a new Pattern" : "Cancel"}
      </button>
      {showAllAvailablePhases && (
        <div>
          <h2 className="patterns__availablePhases--header">
            Select phases for the new pattern
          </h2>
          <ul className="patterns__availablePhases">
            {phases.map((phase, index) => (
              <li className="patterns__availablePhases--item" key={index}>
                <h3>{phase.name}</h3>
                <div>
                  <button onClick={() => handlePhasePreview(phase.data)}>
                    Preview
                  </button>
                  <button onClick={() => handlePhaseSelect(phase.name)}>
                    {selectedPhases.includes(phase.name) ? "Remove" : "Add"}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Drag and drop for creating a new pattern */}
          {selectedPhases.length > 0 && (
            <div className="patterns__selected">
              <p>
                Below are the phases you have selected. You can reorder by drag
                and drop.{" "}
                <span onClick={() => setSelectedPhases([])}>Clear all</span>
              </p>
              <DragDropContext onDragEnd={handleDragEndCreate}>
                <Droppable droppableId="selected-phases">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                      {selectedPhases.map((phase, index) => (
                        <Draggable
                          key={phase}
                          draggableId={phase}
                          index={index}
                        >
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
              <div className="patterns__selected--ctn">
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
      )}
      {patterns.length > 0 ? (
        <ul className="patterns">
          <h2 className="patterns__header">Available Pattern(s)</h2>
          {patterns.map((pattern, index) => (
            <li className="patterns__list" key={index}>
              <div className="patterns__list--item">
                <h3>{pattern.name}</h3>
                <div>
                  <button onClick={() => handleSelectPattern(pattern, index)}>
                    {showPatternPhases === index ? "Close" : "See Phases"}
                  </button>
                  <button onClick={() => handleDeletePattern(pattern.name)}>
                    Delete
                  </button>
                </div>
              </div>

              {/* Show phases under the selected pattern */}
              {showPatternPhases === index && (
                <ul className="patterns__phases">
                  <h2 className="patterns__phases--header">
                    {pattern.name} Phases.{" "}
                    <span
                      onClick={() =>
                        setPatternPhaseIsEditable(!patternPhaseIsEditable)
                      }
                    >
                      {patternPhaseIsEditable ? "Cancel" : "Edit"}
                    </span>
                  </h2>

                  {!patternPhaseIsEditable ? (
                    pattern.phases.map((phase: any, index: any) => (
                      <li className="patterns__phases--item" key={index}>
                        <h3>{phase.name}</h3>
                        <div>
                          <button
                            onClick={() => handlePhasePreview(phase.data)}
                          >
                            Preview
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <DragDropContext onDragEnd={handleDragEndEdit}>
                      <Droppable droppableId="phases-edit">
                        {(provided) => (
                          <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {updatedPatternPhases.map((phase, index) => (
                              <Draggable
                                key={phase._id}
                                draggableId={phase._id}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="patterns__phases--item"
                                  >
                                    {phase.name}
                                    <button
                                      onClick={() =>
                                        handleRemovePhase(phase._id)
                                      }
                                    >
                                      Remove
                                    </button>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}

                  {patternPhaseIsEditable && (
                    <Button type="button" onClick={editPatternHandler}>
                      Save
                    </Button>
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="patterns__noPattern">
          You have not created any pattern yet.
        </div>
      )}
    </div>
  );
};

export default BoxTwo;
