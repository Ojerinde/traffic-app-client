import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHook";
import {
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
import { generatePhaseString } from "@/utils/misc";

interface BoxTwoProps {}

interface PhaseConfigType {
  _id: string;
  name: string;
  data: string;
  duration: string;
  blinkEnabled: boolean;
  blinkTimeRedToGreen: number;
  blinkTimeGreenToRed: number;
  amberEnabled: boolean;
  amberDurationRedToGreen: number;
  amberDurationGreenToRed: number;
}

const BoxTwo: React.FC<BoxTwoProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { phases, patterns, configuredPhases } = useAppSelector(
    (state) => state.userDevice
  );
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
  const [phaseToConfigure, setPhaseToConfigure] = useState<
    PhaseConfigType | undefined
  >(undefined);

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
    setSelectedPhases((prev) =>
      prev.includes(phaseName)
        ? prev.filter((p) => p !== phaseName)
        : [...prev, phaseName]
    );
    if (selectedPhases.includes(phaseName)) {
      dispatch(removePhaseConfig(phaseName));
    }
  };
  const handleDragEndCreate = (result: any) => {
    if (!result.destination) return;
    const reorderedPhases = [...selectedPhases];
    const [removed] = reorderedPhases.splice(result.source.index, 1);
    reorderedPhases.splice(result.destination.index, 0, removed);
    setSelectedPhases(reorderedPhases);
  };

  const handleCreatePattern = async () => {
    if (!patternName)
      return emitToastMessage("Pattern name is required", "error");

    if (!configuredPhases || configuredPhases.length === 0) {
      return emitToastMessage("At least one phase must be configured", "error");
    }
    try {
      const email = GetItemFromLocalStorage("user").email;
      console.log("configured Phases", configuredPhases);
      return;
      const { data } = await HttpRequest.post("/patterns", {
        name: patternName,
        email: email,
        configuredPhases,
      });

      emitToastMessage(data.message, "success");
      setPatternName("");
      setSelectedPhases([]);
      dispatch(getUserPattern(email));
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
    }
  };

  // For previewing phase
  const handlePhasePreview = (phaseSignalString: string) => {
    dispatch(setSignalString(phaseSignalString));
    dispatch(setSignalState());
  };

  // Logic for configuring a pattern
  const handleConfigurePhase = (phaseName: any) => {
    const phaseToConfigure = phases.find((p) => p.name === phaseName);
    setPhaseToConfigure(phaseToConfigure);
  };

  // Find the saved configuration for the current pattern
  const savedPhaseConfig = configuredPhases.find(
    (p) => p.phaseId === phaseToConfigure?._id
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      patternName: savedPhaseConfig?.name || phaseToConfigure?.name || "",
      phases: savedPhaseConfig?.phases || [],
      duration: savedPhaseConfig?.duration || "",
      blinkEnabled: savedPhaseConfig?.blinkEnabled || false,
      blinkTimeRedToGreen: savedPhaseConfig?.blinkTimeRedToGreen || 1,
      blinkTimeGreenToRed: savedPhaseConfig?.blinkTimeGreenToRed || 2,
      amberEnabled: savedPhaseConfig?.amberEnabled || true,
      amberDurationRedToGreen: savedPhaseConfig?.amberDurationRedToGreen || 3,
      amberDurationGreenToRed: savedPhaseConfig?.amberDurationGreenToRed || 3,
    },
    validationSchema: Yup.object({
      patternName: Yup.string().required("Pattern name is required"),
      duration: Yup.number().required("Duration is required").min(1),
      blinkTimeRedToGreen: Yup.number().when(
        "blinkEnabled",
        (blinkEnabled, schema) => {
          return blinkEnabled
            ? schema.min(1, "Blink time must be at least 1").max(5).required()
            : schema.notRequired();
        }
      ),
      blinkTimeGreenToRed: Yup.number().when(
        "blinkEnabled",
        (blinkEnabled, schema) => {
          return blinkEnabled
            ? schema.min(1, "Blink time must be at least 1").max(5).required()
            : schema.notRequired();
        }
      ),
      amberDurationRedToGreen: Yup.number().when(
        "amberEnabled",
        (amberEnabled, schema) => {
          return amberEnabled
            ? schema
                .min(1, "Amber duration must be at least 1")
                .max(5)
                .required()
            : schema.notRequired();
        }
      ),
      amberDurationGreenToRed: Yup.number().when(
        "amberEnabled",
        (amberEnabled, schema) => {
          return amberEnabled
            ? schema
                .min(1, "Amber duration must be at least 1")
                .max(5)
                .required()
            : schema.notRequired();
        }
      ),
    }),
    onSubmit: async (values) => {
      const configToSave = {
        phaseId: phaseToConfigure?._id,
        name: phaseToConfigure?.name,
        signalString: phaseToConfigure?.data,
        signalData: generatePhaseString({
          signalString: phaseToConfigure?.data,
          duration: values.duration,
          blinkTimeRedToGreen: values.blinkEnabled
            ? values.blinkTimeRedToGreen
            : undefined,
          blinkTimeGreenToRed: values.blinkEnabled
            ? values.blinkTimeGreenToRed
            : undefined,
          amberDurationRedToGreen: values.amberEnabled
            ? values.amberDurationRedToGreen
            : undefined,
          amberDurationGreenToRed: values.amberEnabled
            ? values.amberDurationGreenToRed
            : undefined,
        }),
        blinkTimeRedToGreen: values.blinkEnabled
          ? values.blinkTimeRedToGreen
          : undefined,
        blinkTimeGreenToRed: values.blinkEnabled
          ? values.blinkTimeGreenToRed
          : undefined,
        amberDurationRedToGreen: values.amberEnabled
          ? values.amberDurationRedToGreen
          : undefined,
        amberDurationGreenToRed: values.amberEnabled
          ? values.amberDurationGreenToRed
          : undefined,
        duration: values.duration,
        blinkEnabled: values.blinkEnabled,
        amberEnabled: values.amberEnabled,
      };

      dispatch(addOrUpdatePhaseConfig(configToSave));
      emitToastMessage("Phase configuration saved temporarily.", "success");
    },
  });
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
                  <button
                    onClick={() => handlePhasePreview(phase.signalString)}
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
                      {selectedPhases.map((phaseName, index) => (
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
                                <button
                                  onClick={() =>
                                    handleConfigurePhase(phaseName)
                                  }
                                >
                                  Configure
                                </button>
                              </div>

                              {/* Confuguration form */}
                              {phaseToConfigure &&
                                phaseToConfigure.name === phaseName && (
                                  <form
                                    onSubmit={formik.handleSubmit}
                                    className="patterns__selected--form"
                                  >
                                    <h3>Phase Settings</h3>

                                    {/* Phase Duration */}
                                    <div className="patterns__selected--item">
                                      <label>Phase Duration</label>
                                      <input
                                        type="number"
                                        name="duration"
                                        value={formik.values.duration}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      {formik.touched.duration &&
                                        formik.errors.duration &&
                                        typeof formik.errors.duration ===
                                          "string" && (
                                          <div>{formik.errors.duration}</div>
                                        )}
                                    </div>

                                    {/* Enable Blink */}
                                    <div className="patterns__selected--item">
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

                                      {/* Blink Time Fields (Red to Green and Green to Red) */}
                                      {formik.values.blinkEnabled && (
                                        <>
                                          <div className="patterns__selected--item">
                                            <label>
                                              Blink Time (Red to Green)
                                            </label>
                                            <input
                                              type="number"
                                              name="blinkTimeRedToGreen"
                                              value={
                                                formik.values
                                                  .blinkTimeRedToGreen
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                            />
                                            {formik.touched
                                              .blinkTimeRedToGreen &&
                                              formik.errors
                                                .blinkTimeRedToGreen &&
                                              typeof formik.errors
                                                .blinkTimeRedToGreen ===
                                                "string" && (
                                                <div>
                                                  {
                                                    formik.errors
                                                      .blinkTimeRedToGreen
                                                  }
                                                </div>
                                              )}
                                          </div>

                                          <div className="patterns__selected--item">
                                            <label>
                                              Blink Time (Green to Red)
                                            </label>
                                            <input
                                              type="number"
                                              name="blinkTimeGreenToRed"
                                              value={
                                                formik.values
                                                  .blinkTimeGreenToRed
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                            />
                                            {formik.touched
                                              .blinkTimeGreenToRed &&
                                              formik.errors
                                                .blinkTimeGreenToRed &&
                                              typeof formik.errors
                                                .blinkTimeGreenToRed ===
                                                "string" && (
                                                <div>
                                                  {
                                                    formik.errors
                                                      .blinkTimeGreenToRed
                                                  }
                                                </div>
                                              )}
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    {/* Enable Amber */}
                                    <div className="patterns__selected--item">
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

                                      {/* Amber Duration Fields (Red to Green and Green to Red) */}
                                      {formik.values.amberEnabled && (
                                        <>
                                          <div className="patterns__selected--item">
                                            <label>
                                              Amber Duration (Red to Green)
                                            </label>
                                            <input
                                              type="number"
                                              name="amberDurationRedToGreen"
                                              value={
                                                formik.values
                                                  .amberDurationRedToGreen
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                            />
                                            {formik.touched
                                              .amberDurationRedToGreen &&
                                              formik.errors
                                                .amberDurationRedToGreen &&
                                              typeof formik.errors
                                                .amberDurationRedToGreen ===
                                                "string" && (
                                                <div>
                                                  {
                                                    formik.errors
                                                      .amberDurationRedToGreen
                                                  }
                                                </div>
                                              )}
                                          </div>

                                          <div className="patterns__selected--item">
                                            <label>
                                              Amber Duration (Green to Red)
                                            </label>
                                            <input
                                              type="number"
                                              name="amberDurationGreenToRed"
                                              value={
                                                formik.values
                                                  .amberDurationGreenToRed
                                              }
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                            />
                                            {formik.touched
                                              .amberDurationGreenToRed &&
                                              formik.errors
                                                .amberDurationGreenToRed &&
                                              typeof formik.errors
                                                .amberDurationGreenToRed ===
                                                "string" && (
                                                <div>
                                                  {
                                                    formik.errors
                                                      .amberDurationGreenToRed
                                                  }
                                                </div>
                                              )}
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    {/* Submit Button */}
                                    <button type="submit">
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
                    pattern.phases.map((phase: any, index: any) => (
                      <li className="patterns__phases--item" key={index}>
                        <h3>{phase.name}</h3>
                        <div>
                          <button
                            onClick={() =>
                              handlePhasePreview(phase.signalString)
                            }
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
