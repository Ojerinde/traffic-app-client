"use client";
import React from "react";
import {
  setSignalState,
  setSignalString,
  validateConfig,
} from "@/store/signals/SignalConfigSlice";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHook";

const SignalConfigurator: React.FC = () => {
  const dispatch = useAppDispatch();
  const signals = useAppSelector((state) => state.signalConfig.signals);
  const warning = useAppSelector((state) => state.signalConfig.warning);

  const handleChange = (
    direction: "N" | "E" | "S" | "W",
    field: keyof (typeof signals)["N"],
    value: "R" | "A" | "G"
  ) => {
    dispatch(setSignalState({ direction, field, value }));
    dispatch(validateConfig());
  };

  const applyConfig = () => {
    dispatch(validateConfig());
    dispatch(setSignalString());
  };

  return (
    <div>
      <h2 className="intersectionConfigPage__patterns--header">
        Configure Traffic Signals
      </h2>
      {Object.keys(signals).map((direction) => (
        <div key={direction}>
          <h3>{direction} Direction</h3>
          <label>
            Left:
            <select
              value={signals[direction as keyof typeof signals].left}
              onChange={(e) =>
                handleChange(
                  direction as "N" | "E" | "S" | "W",
                  "left",
                  e.target.value as "R" | "A" | "G"
                )
              }
            >
              <option value="R">Red</option>
              <option value="A">Amber</option>
              <option value="G">Green</option>
            </select>
          </label>
          <label>
            Straight:
            <select
              value={signals[direction as keyof typeof signals].straight}
              onChange={(e) =>
                handleChange(
                  direction as "N" | "E" | "S" | "W",
                  "straight",
                  e.target.value as "R" | "A" | "G"
                )
              }
            >
              <option value="R">Red</option>
              <option value="A">Amber</option>
              <option value="G">Green</option>
            </select>
          </label>
          <label>
            Right:
            <select
              value={signals[direction as keyof typeof signals].right}
              onChange={(e) =>
                handleChange(
                  direction as "N" | "E" | "S" | "W",
                  "right",
                  e.target.value as "R" | "A" | "G"
                )
              }
            >
              <option value="R">Red</option>
              <option value="A">Amber</option>
              <option value="G">Green</option>
            </select>
          </label>
          <label>
            Bicycle:
            <select
              value={signals[direction as keyof typeof signals].bike}
              onChange={(e) =>
                handleChange(
                  direction as "N" | "E" | "S" | "W",
                  "bike",
                  e.target.value as "R" | "G"
                )
              }
            >
              <option value="R">Red</option>
              <option value="G">Green</option>
            </select>
          </label>
          <label>
            Pedestrian:
            <select
              value={signals[direction as keyof typeof signals].pedestrian}
              onChange={(e) =>
                handleChange(
                  direction as "N" | "E" | "S" | "W",
                  "pedestrian",
                  e.target.value as "R" | "G"
                )
              }
            >
              <option value="R">Red</option>
              <option value="G">Green</option>
            </select>
          </label>
        </div>
      ))}
      {warning && <p style={{ color: "red" }}>{warning}</p>}
      <button onClick={applyConfig}>Apply Configuration</button>
    </div>
  );
};

export default SignalConfigurator;
