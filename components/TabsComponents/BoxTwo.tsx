import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHook";
import {
  closePreviewCreatedPatternPhase,
  previewCreatedPatternPhase,
  setIsIntersectionConfigurable,
  setSignalState,
  setSignalString,
} from "@/store/signals/SignalConfigSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";
import {
  addOrUpdatePhaseConfig,
  getUserPattern,
  removePhaseConfig,
} from "@/store/devices/UserDeviceSlice";
import Button from "../UI/Button/Button";
import {
  FaPlay,
  FaPause,
  FaTrashAlt,
  FaArrowRight,
  FaArrowLeft,
  FaEllipsisH,
} from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

interface BoxTwoProps {}

interface PhaseConfigType {
  _id: string;
  name: string;
  data: string;
  duration: string;
}

const BoxTwo: React.FC<BoxTwoProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { phases, patterns, configuredPhases } = useAppSelector(
    (state) => state.userDevice
  );

  const [showAllAvailablePhases, setShowAllAvailablePhases] =
    useState<boolean>(false);
  const [showOtherPatternConfig, setShowOtherPatternConfig] =
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
  const [phaseToConfigure, setPhaseToConfigure] =
    useState<PhaseConfigType | null>(null);
  const [activeOrLastAddedPhase, setActiveOrLastAddedPhase] =
    useState<string>("");
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const [activePreviewPhase, setActivePreviewPhase] = useState(null);
  const [searchedResult, setSearchedResult] = useState<any[]>([]);
  const [showSearchedResult, setShowSearchedResult] = useState<boolean>(false);
  const [inputtedPatternName, setInputtedPatternName] = useState<string>("");

  const searchPatternByName = (patternName: string) => {
    const matchedPhases = patterns.filter((pattern) =>
      pattern.name.toLowerCase().includes(patternName.toLowerCase())
    );
    setSearchedResult(matchedPhases);
  };
  const patternsToShow = showSearchedResult ? searchedResult : patterns;

  const handleActionClick = (action: string) => {
    setActiveAction(action);
  };
  const handleSelectPattern = (pattern: any, index: number) => {
    if (showPatternPhases === index) {
      setShowPatternPhases(null);
      setSelectedPattern(null);
    } else {
      setShowPatternPhases(index);
      setSelectedPattern(pattern);
      setUpdatedPatternPhases(pattern?.phases);
    }
  };

  const handleDeletePattern = async (patternName: string) => {
    const confirmResult = confirm(
      `Are you sure you want to delete "${patternName}" pattern?`
    );
    if (!confirmResult) return;
    const pattern = patterns?.find((p) => p.name === patternName);
    const patternId = pattern?._id;

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
    const updatedPhases = updatedPatternPhases?.filter(
      (phase) => phase._id !== phaseId
    );
    setUpdatedPatternPhases(updatedPhases);
  };

  const editPatternHandler = async () => {
    console.log("Saving updated phases for a pattern", updatedPatternPhases);
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
  const handlePhaseSelect = (phaseName: string) => {
    setSelectedPhases((prev) => {
      const isPhaseSelected = prev.includes(phaseName);
      const newSelectedPhases = isPhaseSelected
        ? prev.filter((p) => p !== phaseName)
        : [...prev, phaseName];

      if (isPhaseSelected) {
        dispatch(removePhaseConfig(phaseName));
      }

      return newSelectedPhases;
    });
  };

  const handleDragEndCreate = (result: any) => {
    if (!result.destination) return;
    const reorderedPhases = [...selectedPhases];
    const [removed] = reorderedPhases.splice(result.source.index, 1);
    reorderedPhases.splice(result.destination.index, 0, removed);
    setSelectedPhases(reorderedPhases);
  };

  // For previewing phase
  const handlePhasePreview = (phaseSignalString: string, phaseName: string) => {
    dispatch(setSignalString(phaseSignalString));
    dispatch(setSignalState());
    setActiveOrLastAddedPhase(phaseName);
  };
  const handleCreatedPatternPhasePreview = (phase: any) => {
    if (activePreviewPhase === phase.name) {
      dispatch(closePreviewCreatedPatternPhase());
      setActivePreviewPhase(null);
    } else {
      if (activePreviewPhase) {
        dispatch(closePreviewCreatedPatternPhase());
      }
      dispatch(
        previewCreatedPatternPhase({
          duration: phase.duration,
          signalString: phase.signalString,
        })
      );
      setActivePreviewPhase(phase.name);
    }
  };

  // Logic for configuring a pattern
  const handleConfigurePhase = (phaseName: string) => {
    if (
      phaseToConfigure &&
      phaseToConfigure.name !== phaseName &&
      phaseFormik.dirty
    ) {
      const confirmSwitch = window.confirm(
        "You have unsaved changes. Do you want to switch to configuring a different phase without saving?"
      );
      if (!confirmSwitch) return;
    }

    const phaseToConfig = phases.find((p) => p.name === phaseName);
    if (phaseToConfig) {
      setPhaseToConfigure(phaseToConfig);
      phaseFormik.resetForm({
        values: {
          duration:
            configuredPhases.find((p) => p.phaseId === phaseToConfig._id)
              ?.duration || "",
        },
      });
    }
  };

  const phaseFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      duration: phaseToConfigure
        ? configuredPhases.find((p) => p.phaseId === phaseToConfigure._id)
            ?.duration || ""
        : "",
    },
    validationSchema: Yup.object({
      duration: Yup.number()
        .required("Duration is required")
        .min(1, "Minimum duration is 1"),
    }),
    onSubmit: async (values) => {
      if (phaseToConfigure) {
        const configToSave = {
          phaseId: phaseToConfigure._id,
          name: phaseToConfigure.name,
          signalString: phaseToConfigure.data,
          duration: values.duration,
        };
        dispatch(addOrUpdatePhaseConfig(configToSave));
        emitToastMessage("Phase configuration saved temporarily.", "success");
        setPhaseToConfigure(null);
      }
    },
  });

  const allPhasesConfigured =
    selectedPhases.length > 0 &&
    selectedPhases.every((phase) =>
      configuredPhases.some((p) => p.name === phase)
    );
  const handleCancel = () => {
    setShowAllAvailablePhases(false);
    setShowOtherPatternConfig(false);
    setSelectedPhases([]);
  };
  useEffect(() => {
    dispatch(setIsIntersectionConfigurable(false));
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      patternName: "",
      blinkEnabled: false,
      blinkTimeRedToGreen: 1,
      blinkTimeGreenToRed: 2,
      amberEnabled: true,
      amberDurationRedToGreen: 3,
      amberDurationGreenToRed: 3,
    },
    validationSchema: Yup.object({
      patternName: Yup.string().required("Pattern name is required"),
      blinkTimeRedToGreen: Yup.number().when(
        "blinkEnabled",
        (blinkEnabled, schema) =>
          blinkEnabled
            ? schema
                .min(1, "Blink time must be at least 1")
                .max(5, "Blink time must be at most 5")
                .required("Blink time is required")
            : schema.notRequired()
      ),
      blinkTimeGreenToRed: Yup.number().when(
        "blinkEnabled",
        (blinkEnabled, schema) =>
          blinkEnabled
            ? schema
                .min(1, "Blink time must be at least 1")
                .max(5, "Blink time must be at most 5")
                .required("Blink time is required")
            : schema.notRequired()
      ),
      amberDurationRedToGreen: Yup.number().when(
        "amberEnabled",
        (amberEnabled, schema) =>
          amberEnabled
            ? schema
                .min(1, "Amber duration must be at least 1")
                .max(5, "Amber duration must be at most 5")
                .required("Amber duration is required")
            : schema.notRequired()
      ),
      amberDurationGreenToRed: Yup.number().when(
        "amberEnabled",
        (amberEnabled, schema) =>
          amberEnabled
            ? schema
                .min(1, "Amber duration must be at least 1")
                .max(5, "Amber duration must be at most 5")
                .required("Amber duration is required")
            : schema.notRequired()
      ),
    }),
    onSubmit: async (values) => {
      try {
        const email = GetItemFromLocalStorage("user").email;

        const { data } = await HttpRequest.post("/patterns", {
          name: values.patternName,
          email: email,
          blinkEnabled: values.blinkEnabled,
          blinkTimeRedToGreen: values.blinkTimeRedToGreen,
          blinkTimeGreenToRed: values.blinkTimeGreenToRed,
          amberEnabled: values.amberEnabled,
          amberDurationRedToGreen: values.amberDurationRedToGreen,
          amberDurationGreenToRed: values.amberDurationGreenToRed,
          configuredPhases: configuredPhases,
        });

        emitToastMessage(data.message, "success");
        dispatch(getUserPattern(email));
        handleCancel();
      } catch (error: any) {
        emitToastMessage(
          error?.response?.data?.message || "An error occurred",
          "error"
        );
      }
    },
  });

  return (
    <div className="boxTwo">
      {/* Logic to add a new pattern */}
      <div className="patterns__buttonBox">
        {!showAllAvailablePhases && !showOtherPatternConfig && (
          <button onClick={() => setShowAllAvailablePhases(true)}>
            Add a new Pattern
          </button>
        )}
        {(showAllAvailablePhases || showOtherPatternConfig) && (
          <button onClick={handleCancel}>Cancel</button>
        )}
      </div>
      {/* Show avalible phases for configuration */}
      {showAllAvailablePhases && (
        <>
          <h2 className="patterns__availablePhases--header">
            Select phases for the new pattern
          </h2>
          <ul className="patterns__availablePhases">
            {phases?.map((phase: any, index: any) => (
              <li
                className={`patterns__availablePhases--item ${
                  activeOrLastAddedPhase === phase.name && "active"
                }`}
                key={index}
              >
                <h3>{phase.name}</h3>
                <div>
                  <button
                    onClick={() => handlePhasePreview(phase.data, phase.name)}
                  >
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
          {selectedPhases?.length > 0 && (
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
                      {selectedPhases?.map((phaseName, index) => (
                        <Draggable
                          key={phaseName}
                          draggableId={phaseName}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="row">
                                <h3>{phaseName}</h3>
                                <form onSubmit={phaseFormik.handleSubmit}>
                                  {phaseToConfigure &&
                                  phaseToConfigure.name === phaseName ? (
                                    <>
                                      <input
                                        id="duration"
                                        name="duration"
                                        type="number"
                                        value={phaseFormik.values.duration}
                                        onChange={phaseFormik.handleChange}
                                        onBlur={phaseFormik.handleBlur}
                                      />
                                      <button
                                        type="submit"
                                        disabled={
                                          !phaseFormik.values.duration ||
                                          !phaseFormik.dirty
                                        }
                                      >
                                        Save
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      {configuredPhases.find(
                                        (p) => p.name === phaseName
                                      )?.duration ? (
                                        <span>
                                          Dur:{" "}
                                          {
                                            configuredPhases.find(
                                              (p) => p.name === phaseName
                                            )?.duration
                                          }
                                        </span>
                                      ) : null}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleConfigurePhase(phaseName)
                                        }
                                      >
                                        {configuredPhases.find(
                                          (p) => p.name === phaseName
                                        )?.duration
                                          ? "Edit Duration"
                                          : "Set Duration"}
                                      </button>
                                    </>
                                  )}
                                </form>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
          {selectedPhases.length > 0 && (
            <Button
              type="button"
              onClick={() => {
                setShowAllAvailablePhases(false);
                setShowOtherPatternConfig(true);
              }}
              disabled={!allPhasesConfigured}
            >
              Continue pattern creation
            </Button>
          )}
        </>
      )}

      {/* Show blink and amber configuration and create pattern*/}
      {showOtherPatternConfig && (
        <div>
          <form
            onSubmit={formik.handleSubmit}
            className="patterns__selected--form"
          >
            <h3>Blink and Amber Configuration</h3>
            <div className="patterns__selected--title">
              <label>
                <input
                  type="checkbox"
                  name="blinkEnabled"
                  checked={formik.values.blinkEnabled}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                Enable Blink
              </label>

              {formik.values.blinkEnabled && (
                <>
                  <div className="patterns__selected--item">
                    <label>Blink Time (Red to Green)</label>
                    <input
                      type="number"
                      name="blinkTimeRedToGreen"
                      value={formik.values.blinkTimeRedToGreen}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.blinkTimeRedToGreen &&
                      formik.errors.blinkTimeRedToGreen && (
                        <div>{formik.errors.blinkTimeRedToGreen}</div>
                      )}
                  </div>

                  <div className="patterns__selected--item">
                    <label>Blink Time (Green to Red)</label>
                    <input
                      type="number"
                      name="blinkTimeGreenToRed"
                      value={formik.values.blinkTimeGreenToRed}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.blinkTimeGreenToRed &&
                      formik.errors.blinkTimeGreenToRed && (
                        <div>{formik.errors.blinkTimeGreenToRed}</div>
                      )}
                  </div>
                </>
              )}
            </div>

            <div className="patterns__selected--title">
              <label>
                <input
                  type="checkbox"
                  name="amberEnabled"
                  checked={formik.values.amberEnabled}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                Enable Amber
              </label>

              {formik.values.amberEnabled && (
                <>
                  <div className="patterns__selected--item">
                    <label>Amber Duration (Red to Green)</label>
                    <input
                      type="number"
                      name="amberDurationRedToGreen"
                      value={formik.values.amberDurationRedToGreen}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.amberDurationRedToGreen &&
                      formik.errors.amberDurationRedToGreen && (
                        <div>{formik.errors.amberDurationRedToGreen}</div>
                      )}
                  </div>

                  <div className="patterns__selected--item">
                    <label>Amber Duration (Green to Red)</label>
                    <input
                      type="number"
                      name="amberDurationGreenToRed"
                      value={formik.values.amberDurationGreenToRed}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.amberDurationGreenToRed &&
                      formik.errors.amberDurationGreenToRed && (
                        <div>{formik.errors.amberDurationGreenToRed}</div>
                      )}
                  </div>
                </>
              )}
            </div>

            <div className="patterns__selected--ctn">
              <input
                type="text"
                id="patternName"
                name="patternName"
                value={formik.values.patternName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.patternName && formik.errors.patternName && (
                <div>{formik.errors.patternName}</div>
              )}
              <button type="submit" disabled={!formik.isValid || !formik.dirty}>
                Create pattern
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Available Patterns */}
      {patterns?.length > 0 ? (
        <>
          <div className="patterns__header">
            <h2>Available Pattern(s)</h2>
            <form
              action=""
              onSubmit={(e: any) => {
                e.preventDefault();
                searchPatternByName(inputtedPatternName);
              }}
            >
              <input
                type="text"
                placeholder="Find a pattern by its name"
                value={inputtedPatternName}
                onChange={(e) => {
                  setInputtedPatternName(e.target.value);
                  searchPatternByName(e.target.value);
                  setShowSearchedResult(true);
                }}
              />
            </form>
          </div>
          <ul className="patterns">
            {patternsToShow?.map((pattern, index) => (
              <li className="patterns__list" key={index}>
                <div className="patterns__list--item">
                  <h3>{pattern.name}</h3>
                  <div>
                    {/* Show More (Ellipsis) Button */}
                    <button
                      className={activeAction === "more" ? "active" : ""}
                      onClick={() => {
                        handleActionClick("more");
                        handleSelectPattern(pattern, index);
                      }}
                    >
                      {showPatternPhases === index ? (
                        <MdExpandLess />
                      ) : (
                        <MdExpandMore />
                      )}
                    </button>
                    {/* Previous Button */}
                    <button
                      className={activeAction === "prev" ? "active" : ""}
                      onClick={() => {
                        handleActionClick("prev");
                      }}
                    >
                      <FaArrowLeft />
                    </button>

                    {/* Play/Pause Button */}
                    <button
                      className={activeAction === "play" ? "active" : ""}
                      onClick={() => {
                        handleActionClick("play");
                      }}
                    >
                      <FaPlay />
                      {/* {showPatternPhases === index ? <FaPause /> : <FaPlay />} */}
                    </button>
                    {/* Next Button */}
                    <button
                      className={activeAction === "next" ? "active" : ""}
                      onClick={() => {
                        handleActionClick("next");
                      }}
                    >
                      <FaArrowRight />
                    </button>
                    {/* Delete Button */}
                    <button
                      className={activeAction === "delete" ? "active" : ""}
                      onClick={() => {
                        handleActionClick("delete");
                        handleDeletePattern(pattern.name);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>

                {/* Show phases under the selected pattern */}
                {showPatternPhases === index && (
                  <ul className="patterns__phases">
                    <h2 className="patterns__phases--header">
                      {pattern.name} phases{" "}
                      <span
                        onClick={() =>
                          setPatternPhaseIsEditable(!patternPhaseIsEditable)
                        }
                      >
                        {patternPhaseIsEditable ? "Cancel" : "Edit"}
                      </span>
                    </h2>

                    {!patternPhaseIsEditable ? (
                      pattern.configuredPhases?.map(
                        (phase: any, index: any) => (
                          <li
                            className={`patterns__phases--item ${
                              activePreviewPhase === phase.name ? "active" : ""
                            }`}
                            key={index}
                          >
                            <h3>{phase.name}</h3>
                            <div>
                              <button
                                onClick={() =>
                                  handleCreatedPatternPhasePreview(phase)
                                }
                              >
                                {activePreviewPhase === phase.name
                                  ? "Close"
                                  : "Preview"}
                              </button>
                            </div>
                          </li>
                        )
                      )
                    ) : (
                      <DragDropContext onDragEnd={handleDragEndEdit}>
                        <Droppable droppableId="phases-edit">
                          {(provided) => (
                            <ul
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {updatedPatternPhases?.map((phase, index) => (
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
        </>
      ) : (
        <div className="patterns__noPattern">
          You have not created any pattern yet.
        </div>
      )}
    </div>
  );
};

export default BoxTwo;
