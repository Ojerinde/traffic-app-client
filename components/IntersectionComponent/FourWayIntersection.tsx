"use client";

import React, { useMemo } from "react";
import IntersectionDisplay from "./Intersection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";

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
      return { top: 22.5, left: -30 };
    case "E":
      return { top: -36, left: -35 };
    case "S":
      return { top: -40, left: 76 };
    case "W":
      return { top: 74, left: 27 };
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
  const { signals: trafficSignals, signalString } = useAppSelector(
    (state) => state.signalConfig
  );

  const signalsArray = useMemo(
    () =>
      Object.keys(trafficSignals).map((direction) => {
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
      }),
    [trafficSignals] // Recompute only when trafficSignals changes
  );

  return (
    <div>
      <IntersectionDisplay
        initialSignals={signalsArray}
        backgroundImage="/images/cross.png"
        editable={editable}
      />
    </div>
  );
};

export default FourWayIntersection;
