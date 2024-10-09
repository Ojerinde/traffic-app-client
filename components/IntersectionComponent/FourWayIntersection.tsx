"use client";

import React, { useEffect, useMemo, useState } from "react";
import IntersectionDisplay from "./Intersection";
import { useAppSelector } from "@/hooks/reduxHook";

const positions = {
  N: {
    1400: { top: 22.5, left: 34.7 },
    1300: { top: 23, left: 35.2 },
    1100: { top: 26, left: 35 },
    900: { top: 26.8, left: 35.5 },
    768: { top: 27, left: 36 },
    500: { top: 27.5, left: 35 },
    400: { top: 28, left: 34.8 },
  },
  E: {
    1400: { top: 36, left: 74 },
    1300: { top: 36.3, left: 73.5 },
    1100: { top: 38, left: 73.3 },
    900: { top: 39, left: 66 },
    768: { top: 40, left: 60 },
    500: { top: 41, left: 55 },
    400: { top: 38.8, left: 73.5 },
  },
  S: {
    1400: { top: 74, left: 49.8 },
    1300: { top: 74.5, left: 50 },
    1100: { top: 71, left: 49.8 },
    900: { top: 64, left: 42 },
    768: { top: 58, left: 40 },
    500: { top: 52, left: 36 },
    400: { top: 69.8, left: 49.7 },
  },
  W: {
    1400: { top: 50.3, left: 21 },
    1300: { top: 50.6, left: 21.7 },
    1100: { top: 50.4, left: 22 },
    900: { top: 44, left: 18 },
    768: { top: 42, left: 16 },
    500: { top: 40, left: 14 },
    400: { top: 50.3, left: 21 },
  },
};

const pedestrianPositions = {
  N: {
    1400: { first: { top: 23, left: -18 }, second: { top: 23, left: 150 } },
    1300: { first: { top: 23, left: -19 }, second: { top: 23, left: 159 } },
    1100: { first: { top: 23, left: -14 }, second: { top: 23, left: 143 } },
    900: { first: { top: 18, left: -15 }, second: { top: 18, left: 130 } },
    768: { first: { top: 16, left: -12 }, second: { top: 16, left: 120 } },
    500: { first: { top: 14, left: -10 }, second: { top: 14, left: 110 } },
    400: { first: { top: 18, left: -10 }, second: { top: 18, left: 110 } },
  },
  E: {
    1400: { first: { top: -20, left: -25 }, second: { top: 145, left: -25 } },
    1300: { first: { top: -22, left: -25 }, second: { top: 158, left: -25 } },
    1100: { first: { top: -18, left: -23 }, second: { top: 140, left: -23 } },
    900: { first: { top: -16, left: -21 }, second: { top: 125, left: -21 } },
    768: { first: { top: -14, left: -20 }, second: { top: 115, left: -20 } },
    500: { first: { top: -12, left: -18 }, second: { top: 105, left: -18 } },
    400: { first: { top: -13, left: -14 }, second: { top: 107, left: -14 } },
  },
  S: {
    1400: { first: { top: -25, left: -95 }, second: { top: -25, left: 73 } },
    1300: { first: { top: -25, left: -99 }, second: { top: -25, left: 78 } },
    1100: { first: { top: -23, left: -85 }, second: { top: -23, left: 72 } },
    900: { first: { top: -21, left: -85 }, second: { top: -21, left: 63 } },
    768: { first: { top: -19, left: -80 }, second: { top: -19, left: 58 } },
    500: { first: { top: -17, left: -75 }, second: { top: -17, left: 53 } },
    400: { first: { top: -20, left: -65 }, second: { top: -20, left: 55 } },
  },
  W: {
    1400: { first: { top: 70, left: 25 }, second: { top: -95, left: 25 } },
    1300: { first: { top: 75, left: 25 }, second: { top: -100, left: 25 } },
    1100: { first: { top: 67, left: 23 }, second: { top: -85, left: 23 } },
    900: { first: { top: 60, left: 21 }, second: { top: -85, left: 21 } },
    768: { first: { top: 55, left: 20 }, second: { top: -80, left: 20 } },
    500: { first: { top: 50, left: 18 }, second: { top: -75, left: 18 } },
    400: { first: { top: 53, left: 22 }, second: { top: -68, left: 22 } },
  },
};

const breakpoints = [1400, 1300, 1100, 900, 768, 500, 400];

const getResponsiveValue = <T,>(
  direction: "N" | "E" | "S" | "W",
  values: Record<"N" | "E" | "S" | "W", Record<number, T>>,
  screenWidth: number
): T => {
  const closestBreakpoint =
    breakpoints.find(
      (bp) => screenWidth >= bp - 99 && screenWidth <= bp + 99
    ) || 1400;

  return values[direction][closestBreakpoint];
};

const getOrientation = (
  direction: "N" | "E" | "S" | "W"
): "vertical" | "horizontal" => {
  return direction === "N" || direction === "S" ? "vertical" : "horizontal";
};

const FourWayIntersection = ({ editable }: { editable: boolean }) => {
  const {
    signals: trafficSignals,
    createdPatternPhasePreviewing,
    manualMode,
  } = useAppSelector((state) => state.signalConfig);

  const [screenWidth, setScreenWidth] = useState(window?.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // console.log(
  //   "FourWayIntersection -> screenWidth",
  //   screenWidth,
  //   getResponsiveValue("N" as "N" | "E" | "S" | "W", positions, screenWidth)
  // );

  const signalsArray = useMemo(
    () =>
      Object.keys(trafficSignals).map((direction) => {
        const signalState =
          trafficSignals[direction as keyof typeof trafficSignals];
        return {
          direction: direction as "N" | "E" | "S" | "W",
          ...signalState,
          position: getResponsiveValue(
            direction as "N" | "E" | "S" | "W",
            positions,
            screenWidth
          ),
          pedestrianPosition: getResponsiveValue(
            direction as "N" | "E" | "S" | "W",
            pedestrianPositions,
            screenWidth
          ),
          orientation: getOrientation(direction as "N" | "E" | "S" | "W"),
        };
      }),
    [trafficSignals, screenWidth]
  );

  return (
    <>
      <IntersectionDisplay
        initialSignals={signalsArray}
        backgroundImage="/images/cross.png"
        editable={editable}
        manualMode={manualMode}
        createdPatternPhasePreviewing={createdPatternPhasePreviewing}
      />
    </>
  );
};

export default FourWayIntersection;
