"use client";

import React, { useEffect } from "react";
import IntersectionDisplay from "./Intersection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { setSignalString } from "@/store/signals/SignalConfigSlice";

const getPosition = (direction: "N" | "E" | "S" | "W") => {
  switch (direction) {
    case "N":
      return { top: 22.5, left: 30 };
    case "E":
      return { top: 32.5, left: 75 };
    case "S":
      return { top: 74, left: 49.8 };
    case "W":
      return { top: 50.2, left: 20 };
    default:
      return { top: 0, left: 0 };
  }
};

const getOrientation = (
  direction: "N" | "E" | "S" | "W"
): "vertical" | "horizontal" => {
  return direction === "N" || direction === "S" ? "vertical" : "horizontal";
};

const FourWayIntersection: React.FC = () => {
  const dispatch = useAppDispatch();
  const trafficSignals = useAppSelector((state) => state.signalConfig.signals);
  const signalString = useAppSelector(
    (state) => state.signalConfig.signalString
  );

  useEffect(() => {
    const updateSignals = () => {
      dispatch(setSignalString());
    };

    // Initial update
    updateSignals();

    const interval = setInterval(updateSignals, 5000);

    return () => clearInterval(interval);
  }, [dispatch, signalString]);

  // Convert the object to an array of Signal objects
  const signalsArray = Object.keys(trafficSignals).map((direction) => {
    const signalState =
      trafficSignals[direction as keyof typeof trafficSignals];
    return {
      direction: direction as "N" | "E" | "S" | "W",
      ...signalState,
      position: getPosition(direction as "N" | "E" | "S" | "W"), // Add positions based on direction
      orientation: getOrientation(direction as "N" | "E" | "S" | "W"), // Define orientation (vertical or horizontal)
    };
  });

  return (
    <div>
      <IntersectionDisplay
        signals={signalsArray} // Pass the array to IntersectionDisplay
        backgroundImage="/images/cross.jpg"
      />
    </div>
  );
};

export default FourWayIntersection;
