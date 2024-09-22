"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { useFormik } from "formik";
import * as Yup from "yup";
import { emitToastMessage } from "@/utils/toastFunc";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import Button from "../UI/Button/Button";
import SelectField from "../UI/SelectField/SelectField";
import {
  addOrUpdatePatternConfig,
  getUserGroup,
  removePatternConfig,
} from "@/store/devices/UserDeviceSlice";

interface PaternToConfigureTypes {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface BoxThreeProps {}
const BoxThree: React.FC<BoxThreeProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { patterns, groups, configuredPatterns } = useAppSelector(
    (state) => state.userDevice
  );
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [groupOptions, setGroupOptions] = useState<any>(
    groups?.map((group) => ({
      value: group.name,
      label: group.name,
    }))
  );
  const [patternToConfigure, setPatternToConfigure] = useState<
    PaternToConfigureTypes | undefined
  >(undefined);
  const [showAllAvailablePatterns, setShowAllAvailablePatterns] =
    useState<boolean>(false);
  const [showDifferentDaysGroup, setShowDifferentDaysGroup] =
    useState<boolean>(false);
  const [showGroupPatterns, setShowGroupPatterns] = useState<number | null>(
    null
  );
  const [updatedGroupPatterns, setUpdatedGroupPatterns] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<{
    name: string;
    phases: any[];
  } | null>(null);
  const [groupPatternIsEditable, setGroupPatternIsEditable] =
    useState<boolean>(false);
  const [searchedResult, setSearchedResult] = useState<any[]>([]);
  const [showSearchedResult, setShowSearchedResult] = useState<boolean>(false);
  const [inputtedGroupName, setInputtedGroupName] = useState<string>("");

  const searchGroupByName = (gruopName: string) => {
    const matchedGroups = groups.filter((group) =>
      group.name.toLowerCase().includes(gruopName.toLowerCase())
    );
    setSearchedResult(matchedGroups);
  };
  const groupsToShow = showSearchedResult ? searchedResult : groups;

  useEffect(() => {
    setGroupOptions(
      groups?.map((group) => ({
        value: group.name,
        label: group.name,
      }))
    );
  }, []);

  const handleAddRemovePattern = (patternName: string) => {
    setSelectedPatterns((prev) =>
      prev.includes(patternName)
        ? prev?.filter((p) => p !== patternName)
        : [...prev, patternName]
    );
    if (selectedPatterns.includes(patternName)) {
      dispatch(removePatternConfig(patternName));
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

    if (!configuredPatterns || configuredPatterns?.length === 0) {
      return emitToastMessage(
        "At least one pattern must be configured",
        "error"
      );
    }
    console.log("A", configuredPatterns);
    try {
      const { data } = await HttpRequest.post("/groups", {
        name: groupName,
        email: GetItemFromLocalStorage("user").email,
        patterns: configuredPatterns?.map((pattern: any) => ({
          name: pattern.name,
          startTime: pattern.startTime,
          endTime: pattern.endTime,
          patternId: pattern.patternId,
        })),
      });

      emitToastMessage(data.message, "success");
      setGroupName("");
      setSelectedPatterns([]);
      dispatch(getUserGroup(GetItemFromLocalStorage("user").email));
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
      console.log("Error", error);
    }
  };

  const handleSelectGroup = (pattern: any, index: number) => {
    if (showGroupPatterns === index) {
      setShowGroupPatterns(null);
      setSelectedGroup(null);
    } else {
      setShowGroupPatterns(index);
      setSelectedGroup(pattern);
      setUpdatedGroupPatterns(pattern.phases);
    }
  };

  // Logic for configuring a pattern
  const handleConfigurePattern = (patternName: any) => {
    const patternToBeConfigured = patterns?.find((p) => p.name === patternName);
    setPatternToConfigure(patternToBeConfigured);
  };

  // Find the saved configuration for the current pattern
  const savedPatternConfig = configuredPatterns?.find(
    (p) => p.name === patternToConfigure?.name
  );

  const patternConfigFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      startTime:
        savedPatternConfig?.startTime || patternToConfigure?.startTime || "",
      endTime: savedPatternConfig?.endTime || patternToConfigure?.endTime || "",
    },
    validationSchema: Yup.object().shape({
      startTime: Yup.string().required("Start time is required"),
      endTime: Yup.string().required("End time is required"),
    }),
    onSubmit: (values: any) => {
      console.log("B", patternToConfigure);

      dispatch(
        addOrUpdatePatternConfig({
          name: patternToConfigure?.name,
          startTime: values.startTime,
          endTime: values.endTime,
        })
      );
      emitToastMessage("Pattern configuration saved temporarily.", "success");
    },
  });

  const handleDeleteGroup = async (groupName: string) => {
    const confirmResult = confirm(
      "Are you sure you want to delete this group?"
    );
    if (!confirmResult) return;
    const group = groups?.find((g) => g.name === groupName);
    const groupId = group?._id;

    try {
      const email = GetItemFromLocalStorage("user").email;
      const { data } = await HttpRequest.delete(`/groups/${groupId}/${email}`);
      emitToastMessage(data.message, "success");
      dispatch(getUserGroup(email));
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
    }
  };

  // Days of the week for looping
  const daysOfWeek = [
    { name: "sunday", label: "Sunday" },
    { name: "monday", label: "Monday" },
    { name: "tuesday", label: "Tuesday" },
    { name: "wednesday", label: "Wednesday" },
    { name: "thursday", label: "Thursday" },
    { name: "friday", label: "Friday" },
    { name: "saturday", label: "Saturday" },
  ];

  interface FormValuesType {
    sunday: { value: string | null; label: string } | null;
    monday: { value: string | null; label: string } | null;
    tuesday: { value: string | null; label: string } | null;
    wednesday: { value: string | null; label: string } | null;
    thursday: { value: string | null; label: string } | null;
    friday: { value: string | null; label: string } | null;
    saturday: { value: string | null; label: string } | null;
  }

  const formik = useFormik<FormValuesType>({
    initialValues: {
      sunday: null,
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
    },
    validationSchema: Yup.object().shape({
      sunday: Yup.object().nullable(),
      monday: Yup.object().nullable(),
      tuesday: Yup.object().nullable(),
      wednesday: Yup.object().nullable(),
      thursday: Yup.object().nullable(),
      friday: Yup.object().nullable(),
      saturday: Yup.object().nullable(),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values, actions) => {
      try {
        // Your submit logic here
        console.log("Submitted values:", values);
      } catch (error: any) {
        // Handle error
      } finally {
        actions.setSubmitting(false);
      }
    },
  });
  console.log("Groups", groups);
  return (
    <div className="newGroup">
      <div className="newGroup__buttons">
        <button
          className="newGroup__button"
          onClick={() => {
            setShowDifferentDaysGroup(false);
            setShowAllAvailablePatterns((prev) => !prev);
          }}
        >
          {!showAllAvailablePatterns ? "Group patterns" : "Cancel"}
        </button>
        <button
          className="newGroup__button"
          onClick={() => {
            setShowAllAvailablePatterns(false);
            setSelectedPatterns([]);
            setShowDifferentDaysGroup((prev) => !prev);
          }}
        >
          {!showDifferentDaysGroup
            ? "Specify Group for Different Days"
            : "Cancel"}
        </button>
      </div>
      {/* Configuring Groups for different days */}
      {showDifferentDaysGroup && (
        <div>
          <form onSubmit={formik.handleSubmit}>
            {daysOfWeek?.map((day) => (
              <SelectField
                key={day.name}
                onChange={(option) => formik.setFieldValue(day.name, option)}
                value={formik.values[day.name as keyof FormValuesType]} // Pass the object value
                options={groupOptions}
                placeholder={`Select ${day.label} Group`}
              />
            ))}
            <Button type="submit">Save</Button>
          </form>
        </div>
      )}

      {/*All other Logics */}
      {showAllAvailablePatterns && (
        <div>
          <h2 className="newGroup__header">
            Select and configure patterns for the new group
          </h2>
          <ul className="newGroup__patterns">
            {patterns?.map((pattern, index) => (
              <li className="newGroup__patterns--item" key={index}>
                <h3>{pattern.name}</h3>
                <div>
                  <button onClick={() => handleAddRemovePattern(pattern.name)}>
                    {selectedPatterns.includes(pattern.name) ? "Remove" : "Add"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedPatterns?.length > 0 && (
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
                  {selectedPatterns?.map((patternName, index) => (
                    <Draggable
                      key={patternName}
                      draggableId={patternName}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="row">
                            <h3>{patternName}</h3>
                            <button
                              onClick={() =>
                                handleConfigurePattern(patternName)
                              }
                            >
                              Configure
                            </button>
                          </div>

                          {/* Configuration Form */}
                          {patternToConfigure &&
                            patternToConfigure.name === patternName && (
                              <form
                                onSubmit={patternConfigFormik.handleSubmit}
                                className="newGroup__selected--form"
                              >
                                <div className="newGroup__selected--time">
                                  <div>
                                    <label>Start Time</label>
                                    <input
                                      type="time"
                                      name="startTime"
                                      value={
                                        patternConfigFormik.values.startTime
                                      }
                                      onChange={
                                        patternConfigFormik.handleChange
                                      }
                                    />
                                    {patternConfigFormik.touched.startTime &&
                                    patternConfigFormik.errors.startTime ? (
                                      <div className="error">
                                        {
                                          patternConfigFormik.errors
                                            .startTime as string
                                        }
                                      </div>
                                    ) : null}
                                  </div>
                                  <div>
                                    <label>End Time</label>
                                    <input
                                      type="time"
                                      name="endTime"
                                      value={patternConfigFormik.values.endTime}
                                      onChange={
                                        patternConfigFormik.handleChange
                                      }
                                    />
                                    {patternConfigFormik.touched.endTime &&
                                    patternConfigFormik.errors.endTime ? (
                                      <div className="error">
                                        {
                                          patternConfigFormik.errors
                                            .endTime as string
                                        }
                                      </div>
                                    ) : null}
                                  </div>
                                </div>

                                <button
                                  disabled={
                                    !patternConfigFormik.isValid ||
                                    patternConfigFormik.isSubmitting
                                  }
                                  type="submit"
                                >
                                  Save Configuration
                                </button>
                              </form>
                            )}
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

      {/* Available Group */}
      {!showDifferentDaysGroup && (
        <>
          <div className="newGroup__header">
            <h2>Available Group(s)</h2>
            <form
              action=""
              onSubmit={(e: any) => {
                e.preventDefault();
                searchGroupByName(inputtedGroupName);
              }}
            >
              <input
                type="text"
                placeholder="Find a group by its name"
                value={inputtedGroupName}
                onChange={(e) => {
                  setInputtedGroupName(e.target.value);
                  searchGroupByName(e.target.value);
                  setShowSearchedResult(true);
                }}
              />
            </form>
          </div>
          {groups?.length > 0 ? (
            <ul className="newGroup__availablePatterns">
              {groups?.map((group, index) => (
                <li className="newGroup__availablePatterns--item" key={index}>
                  <h3>{group.name}</h3>
                  <div>
                    {/* <button onClick={() => handleSelectGroup(group, index)}>
                        {showGroupPatterns === index ? "Close" : "See Patterns"}
                      </button> */}
                    <button onClick={() => handleDeleteGroup(group.name)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="patterns__noPattern">
              You have not created any group yet.
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default BoxThree;
