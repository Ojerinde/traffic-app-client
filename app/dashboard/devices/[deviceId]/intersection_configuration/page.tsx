"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import SelectField, { Option } from "@/components/UI/SelectField/SelectField";
import { useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import FourWayIntersection from "@/components/IntersectionComponent/FourWayIntersection";
import SignalConfigurator from "@/components/IntersectionComponent/SignalConfigurator";

interface IntersectionConfigurationPageProps {
  params: any;
}
const IntersectionConfigurationPage: React.FC<
  IntersectionConfigurationPageProps
> = ({ params }) => {
  const [selectedBox, setSelectedBox] = useState<"patterns" | "schedules">(
    "patterns"
  );
  console.log("Intersection ID Config Page", params);

  const patternOptions: Option[] = [
    { value: "pattern1", label: "Pattern 1 - N,E,W,S,P1,P2" },
    { value: "pattern2", label: "Pattern 2 - N,S,W,E" },
    { value: "pattern3", label: "Pattern 3 - E,W,P1,P2,N,S" },
    { value: "pattern4", label: "Pattern 4 - N,E,W,S,P1,P2" },
    { value: "pattern5", label: "Pattern 5 - N,S,W,E" },
    { value: "pattern6", label: "Pattern 6 - E,W,P1,P2,N,S" },
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

  return (
    <section className="intersectionConfigPage">
      <h2 className="intersectionConfigPage__header">Traffic Flow Design</h2>
      <div className="intersectionConfigPage__box">
        <div className="intersectionConfigPage__box--left">
          <FourWayIntersection />
        </div>
        <div className="intersectionConfigPage__box--right">
          <SignalConfigurator />

          {/* <div className="intersectionConfigPage__buttons">
            <button>
              <FaPlus size={15} />
              <span>New Pattern</span>
            </button>
            <button>
              <FaArrowLeft size={15} />
              <span>Prev. Phase</span>
            </button>
            <button>
              <FaEdit size={15} />
              <span>Edit Pattern</span>
            </button>
            <button>
              <FaArrowRight size={15} />
              <span>Next Phase</span>
            </button>
            <button>
              <FaTrash size={15} />
              <span>Delete Pattern</span>
            </button>
          </div> */}
          <ul>
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
          {selectedBox === "patterns" && (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default IntersectionConfigurationPage;
