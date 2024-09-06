import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHook";
import { setSignalString } from "@/store/signals/SignalConfigSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface EditPatternProps {
  initialPhases: string[];
  onSavePattern: (updatedPhases: string[]) => void;
}

const EditPattern: React.FC<EditPatternProps> = ({
  initialPhases,
  onSavePattern,
}) => {
  const { phases } = useAppSelector((state) => state.userDevice);
  const dispatch = useAppDispatch();
  const [selectedPhases, setSelectedPhases] = useState<string[]>(initialPhases);

  // Function to handle selecting a phase
  const handleSelectPhase = (phaseName: string, signalString: string) => {
    dispatch(setSignalString(signalString));
  };

  // Function to handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedPhases = [...selectedPhases];
    const [removed] = reorderedPhases.splice(result.source.index, 1);
    reorderedPhases.splice(result.destination.index, 0, removed);
    setSelectedPhases(reorderedPhases);
  };

  return (
    <div>
      <h2>Edit Pattern</h2>
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
                        <button onClick={() => handleSelectPhase(phase, "")}>
                          Edit
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
        <button onClick={() => onSavePattern(selectedPhases)}>Save</button>
      </div>
    </div>
  );
};

export default EditPattern;
