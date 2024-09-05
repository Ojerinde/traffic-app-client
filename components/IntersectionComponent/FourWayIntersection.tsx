"use client";

import React, { useEffect } from "react";
import IntersectionDisplay from "./Intersection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { setSignalState } from "@/store/signals/SignalConfigSlice";

const getPosition = (direction: "N" | "E" | "S" | "W") => {
  switch (direction) {
    case "N":
      return { top: 22.5, left: 34.7 };
    case "E":
      return { top: 36, left: 74 };
    case "S":
      return { top: 74, left: 49.8 };
    case "W":
      return { top: 50.3, left: 21 };
    default:
      return { top: 0, left: 0 };
  }
};
const getPedestrianPosition = (direction: "N" | "E" | "S" | "W") => {
  switch (direction) {
    case "N":
      return { top: 22.5, left: -23 };
    case "E":
      return { top: -24, left: -25 };
    case "S":
      return { top: -25, left: 79 };
    case "W":
      return { top: 76, left: 22 };
    default:
      return { top: 0, left: 0 };
  }
};

const getOrientation = (
  direction: "N" | "E" | "S" | "W"
): "vertical" | "horizontal" => {
  return direction === "N" || direction === "S" ? "vertical" : "horizontal";
};

const FourWayIntersection = ({ editable }: { editable: boolean }) => {
  const dispatch = useAppDispatch();
  const trafficSignals = useAppSelector((state) => state.signalConfig.signals);

  useEffect(() => {
    const updateSignals = () => {
      dispatch(setSignalState("*ERRRRRWAAARGSGGGGGNAAAAA#"));
    };

    // Initial update
    updateSignals();

    const interval = setInterval(updateSignals, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const signalsArray = Object.keys(trafficSignals).map((direction) => {
    const signalState =
      trafficSignals[direction as keyof typeof trafficSignals];
    return {
      direction: direction as "N" | "E" | "S" | "W",
      ...signalState,
      position: getPosition(direction as "N" | "E" | "S" | "W"),
      pedestrianPosition: getPedestrianPosition(
        direction as "N" | "E" | "S" | "W"
      ),
      orientation: getOrientation(direction as "N" | "E" | "S" | "W"),
    };
  });

  return (
    <div>
      <IntersectionDisplay
        initialSignals={signalsArray}
        backgroundImage="/images/cross.jpg"
        editable={editable}
      />
    </div>
  );
};

export default FourWayIntersection;
