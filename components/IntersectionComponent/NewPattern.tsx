import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHook";
import {
  setSignalState,
  setSignalString,
} from "@/store/signals/SignalConfigSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
interface NewPatternProps {
  onSavePattern: (selectedPhases: string[]) => void;
}

const NewPattern: React.FC<NewPatternProps> = ({ onSavePattern }) => {
  const { phases } = useAppSelector((state) => state.userDevice);
  const dispatch = useAppDispatch();
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);

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

  // Handle Drag and Drop (reordering)
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedPhases = [...selectedPhases];
    const [removed] = reorderedPhases.splice(result.source.index, 1);
    reorderedPhases.splice(result.destination.index, 0, removed);
    setSelectedPhases(reorderedPhases);
  };

  return (
    <div>
      <h2>Select Phases for the New Pattern</h2>
      <div className="phases-list">
        {phases.map((phase) => (
          <div key={phase.name}>
            <span>{phase.name}</span>
            <button onClick={() => handleSelectPhase(phase.name, phase.data)}>
              Preview
            </button>
            <button onClick={() => handleAddRemovePhase(phase.name)}>
              {selectedPhases.includes(phase.name) ? "Remove" : "Add"}
            </button>
          </div>
        ))}
      </div>
      <div>
        <h3>Selected Phases</h3>
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
        <button onClick={() => onSavePattern(selectedPhases)}>
          Save Pattern
        </button>
      </div>
    </div>
  );
};

export default NewPattern;
