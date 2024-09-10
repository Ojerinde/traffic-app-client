"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { getUserPattern } from "@/store/devices/UserDeviceSlice";
import OverlayModal from "../Modals/OverlayModal";
import ConfigurePatternModal from "../Modals/ConfigurePatternModal";

interface BoxThreeProps {}
const BoxThree: React.FC<BoxThreeProps> = ({}) => {
  const { patterns } = useAppSelector((state) => state.userDevice);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [showConfigModal, setShowConfigureModal] = useState<boolean>(false);
  const [patternToConfigure, setPatternToConfigure] = useState("");
  const dispatch = useAppDispatch();

  const handleAddRemovePattern = (patternName: string) => {
    setSelectedPatterns((prev) =>
      prev.includes(patternName)
        ? prev.filter((p) => p !== patternName)
        : [...prev, patternName]
    );
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

  // Handle Drag and Drop (reordering)
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedPatterns = [...selectedPatterns];
    const [removed] = reorderedPatterns.splice(result.source.index, 1);
    reorderedPatterns.splice(result.destination.index, 0, removed);
    setSelectedPatterns(reorderedPatterns);
  };

  const handleCreateGroup = async () => {
    if (!groupName) return emitToastMessage("Group name is required", "error");
    console.log("Group data", groupName);
    // try {
    //   const { data } = await HttpRequest.post("/groups", {
    //     groupName,
    //     email: GetItemFromLocalStorage("user").email,
    //   });
    //   emitToastMessage(data.message, "success");
    //   setGroupName("");
    // } catch (error: any) {
    //   emitToastMessage(error?.response.data.message, "error");
    //   console.log("Error", error);
    // }
  };

  const handleConfigurePattern = (patternName: any) => {
    const patternToConfigure = patterns.find((p) => p.name === patternName);
    setPatternToConfigure(patternToConfigure);
    setShowConfigureModal(true);
  };

  return (
    <div>
      <div className="newGroup">
        <h2 className="newGroup__header">
          Select multiple pattern for the new group
        </h2>
        <ul className="newGroup__patterns">
          {patterns.map((pattern) => (
            <li className="newGroup__patterns--item" key={pattern.name}>
              <h3>{pattern.name}</h3>
              <div>
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
          <div className="newGroup__selected">
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
                            <h3> {pattern}</h3>
                            <button
                              onClick={() => handleConfigurePattern(pattern)}
                            >
                              Configure
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
            <div className="newGroup__selected--ctn">
              <input
                type="text"
                name="pattern"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
              />
              <button type="button" onClick={handleCreateGroup}>
                Create Group
              </button>
            </div>
          </div>
        )}
        {showConfigModal && (
          <OverlayModal onClose={() => setShowConfigureModal(false)}>
            <ConfigurePatternModal
              pattern={patternToConfigure}
              closeModal={() => setShowConfigureModal(false)}
            />
          </OverlayModal>
        )}
      </div>
    </div>
  );
};
export default BoxThree;
