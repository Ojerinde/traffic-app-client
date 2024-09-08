"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { getUserPattern } from "@/store/devices/UserDeviceSlice";

interface BoxThreeProps {}
const BoxThree: React.FC<BoxThreeProps> = ({}) => {
  const { patterns } = useAppSelector((state) => state.userDevice);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserPattern(GetItemFromLocalStorage("user").email));
  }, []);

  // Function to handle adding/removing a phase
  const handleAddRemovePattern = (patternName: string) => {
    setSelectedPatterns((prev) =>
      prev.includes(patternName)
        ? prev.filter((p) => p !== patternName)
        : [...prev, patternName]
    );
  };
  const handleDeletePattern = (patternName: string) => {
    const confirmResult = confirm(
      "Are you sure you want to delete this pattern?"
    );
    console.log("Confirm result", confirmResult, patternName);
    // Delete the pattern from the list of patterns
  };

  // Handle Drag and Drop (reordering)
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedPatterns = [...selectedPatterns];
    const [removed] = reorderedPatterns.splice(result.source.index, 1);
    reorderedPatterns.splice(result.destination.index, 0, removed);
    setSelectedPatterns(reorderedPatterns);
  };

  const handleCreatePattern = async () => {
    const selectedPatternsId = patterns
      .map((pattern) =>
        selectedPatterns.includes(pattern.name) ? pattern : null
      )
      .filter(Boolean)
      .map((pattern) => pattern._id);
    console.log("Selected patterns data", groupName, selectedPatternsId);
    try {
      const { data } = await HttpRequest.post("/patterns", {
        groupName,
        email: GetItemFromLocalStorage("user").email,
        selectedPatterns: selectedPatternsId,
      });
      emitToastMessage(data.message, "success");
      setGroupName("");
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
      console.log("Error", error);
    }
  };

  return (
    <div>
      <div className="newPattern">
        <h2 className="newPattern__header">
          Select multiple pattern for the new group
        </h2>
        <ul className="newPattern__patterns">
          {patterns.map((pattern) => (
            <li className="newPattern__patterns--item" key={pattern.name}>
              <h3>{pattern.name}</h3>
              <div>
                <button>Configure</button>
                <button onClick={() => handleAddRemovePattern(pattern.name)}>
                  {selectedPatterns.includes(pattern.name) ? "Remove" : "Add"}
                </button>
                <button onClick={() => handleDeletePattern(pattern.name)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {selectedPatterns.length > 0 && (
          <div className="newPattern__selected">
            <p>
              Below are the patterns you have selected. you can reorder by drag
              and drop.{" "}
              <span onClick={() => setSelectedPatterns([])}>Clear all</span>
            </p>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="selected-patterns">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {selectedPatterns.map((pattern, index) => (
                      <Draggable
                        key={pattern}
                        draggableId={pattern}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {pattern}
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
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter pattern name"
              />
              <button type="button" onClick={handleCreatePattern}>
                Create Pattern
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BoxThree;
