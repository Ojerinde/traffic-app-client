"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectField, { Option } from "@/components/UI/SelectField/SelectField";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import FourWayIntersection from "@/components/IntersectionComponent/FourWayIntersection";
import NewPattern from "@/components/IntersectionComponent/NewPattern";
import EditPattern from "@/components/IntersectionComponent/EditPattern";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { setSignalState } from "@/store/signals/SignalConfigSlice";
import Button from "@/components/UI/Button/Button";
interface IntersectionConfigurationPageProps {
  params: any;
}

const IntersectionConfigurationPage: React.FC<
  IntersectionConfigurationPageProps
> = ({ params }) => {
  const dispatch = useAppDispatch();
  const { signals: trafficSignals, signalString } = useAppSelector(
    (state) => state.signalConfig
  );

  const [selectedBox, setSelectedBox] = useState<"patterns" | "schedules">(
    "patterns"
  );
  const [clickedButton, setClickedButton] = useState<"new" | "edit" | "">("");

  const patternOptions: Option[] = [
    { value: "pattern1", label: "Pattern 1 - N,E,W,S,P1,P2" },
    { value: "pattern2", label: "Pattern 2 - N,S,W,E" },
  ];

  const validationSchema = Yup.object({
    pattern: Yup.object().required("Pattern Type is required"),
  });

  const formik = useFormik({
    initialValues: {
      pattern: null,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    async onSubmit(values, actions) {
      const {} = values;
      try {
      } catch (error: any) {
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    dispatch(setSignalState());
  }, [dispatch, signalString]);

  return (
    <section className="intersectionConfigPage">
      <h2 className="intersectionConfigPage__header">Traffic Flow Design</h2>
      <div className="intersectionConfigPage__box">
        <div className="intersectionConfigPage__box--left">
          <FourWayIntersection editable />
        </div>
        <div className="intersectionConfigPage__box--right">
          <div className="intersectionConfigPage__buttons">
            <Button type="button" onClick={() => setClickedButton("new")}>
              <FaPlus size={30} />
            </Button>
            <Button type="button">
              <FaArrowLeft size={30} />
            </Button>
            <Button type="button">
              <FaEdit size={30} />
            </Button>
            <Button type="button">
              <FaArrowRight size={30} />
            </Button>
            <Button type="button">
              <FaTrash size={30} />
            </Button>
          </div>

          {clickedButton === "new" && (
            <NewPattern
              onSavePattern={(pattern) => console.log("Saved pattern", pattern)}
            />
          )}
          {/* Fetch the pattern and pass the phases for the pattern to this */}
          {clickedButton === "edit" && (
            <EditPattern
              initialPhases={[]}
              onSavePattern={(pattern) => console.log("Saved pattern", pattern)}
            />
          )}
          <ul className="intersectionConfigPage__box--tabs">
            <li
              onClick={() => setSelectedBox("patterns")}
              className={`${
                selectedBox === "patterns" &&
                "intersectionConfigPage__box--active"
              }`}
            >
              Patterns
            </li>
            <li
              onClick={() => setSelectedBox("schedules")}
              className={`${
                selectedBox === "schedules" &&
                "intersectionConfigPage__box--active"
              }`}
            >
              Schedules
            </li>
          </ul>
          {/* {selectedBox === "patterns" && (
            <div className="intersectionConfigPage__patterns">
              <h3 className="intersectionConfigPage__patterns--header">
                Group Phase Patterns
              </h3>
              <SelectField
                onChange={(option) => formik.setFieldValue("pattern", option)}
                value={formik.values.pattern}
                options={patternOptions}
                placeholder="Select a Pattern"
              />
            </div>
          )}
          {selectedBox === "schedules" && (
            <div className="intersectionConfigPage__schedules">
              <h3 className="intersectionConfigPage__schedules--header">
                Weekly Program Schedule/Plan
              </h3>
              <SelectField
                onChange={(option) => formik.setFieldValue("pattern", option)}
                value={formik.values.pattern}
                options={patternOptions}
                placeholder="Select a Pattern"
              />
              <div className="deviceConfigPage__button--box">
                <button type="submit">Download Schedule</button>
                <button type="submit" disabled={!formik.isValid}>
                  Upload Schedule
                </button>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </section>
  );
};

export default IntersectionConfigurationPage;
