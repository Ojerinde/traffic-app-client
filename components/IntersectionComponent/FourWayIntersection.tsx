"use client";

import React, { useEffect, useMemo } from "react";
import IntersectionDisplay from "./Intersection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { usePathname } from "next/navigation";
import { setIsIntersectionConfigurable } from "@/store/signals/SignalConfigSlice";

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
      return {
        first: { top: 25, left: -20 },
        second: { top: 25, left: 150 },
      };
    case "E":
      return {
        first: { top: -20, left: -25 },
        second: { top: 145, left: -25 },
      };
    case "S":
      return {
        first: { top: -25, left: -95 },
        second: { top: -25, left: 73 },
      };
    case "W":
      return { first: { top: 70, left: 25 }, second: { top: -95, left: 25 } };
    default:
      return { first: { top: 0, left: 0 }, second: { top: 0, left: 0 } };
  }
};

const getOrientation = (
  direction: "N" | "E" | "S" | "W"
): "vertical" | "horizontal" => {
  return direction === "N" || direction === "S" ? "vertical" : "horizontal";
};

const FourWayIntersection = ({ editable }: { editable: boolean }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { signals: trafficSignals, createdPatternPhasePreviewing } =
    useAppSelector((state) => state.signalConfig);

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
    [trafficSignals]
  );

  return (
    <div>
      <IntersectionDisplay
        initialSignals={signalsArray}
        backgroundImage="/images/cross.png"
        editable={editable}
        createdPatternPhasePreviewing={createdPatternPhasePreviewing}
      />
    </div>
  );
};

export default FourWayIntersection;
