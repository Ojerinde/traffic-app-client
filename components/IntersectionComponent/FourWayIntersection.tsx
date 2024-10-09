"use client";

import React, { useEffect, useMemo, useState } from "react";
import IntersectionDisplay from "./Intersection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { usePathname } from "next/navigation";

const positions = {
  N: {
    1300: { top: 22.5, left: 34.7 },
    1100: { top: 20, left: 30 },
    900: { top: 18, left: 28 },
    768: { top: 16, left: 26 },
    500: { top: 14, left: 24 },
    400: { top: 12, left: 22 },
  },
  E: {
    1300: { top: 36, left: 74 },
    1100: { top: 34, left: 70 },
    900: { top: 32, left: 66 },
    768: { top: 30, left: 60 },
    500: { top: 28, left: 55 },
    400: { top: 26, left: 50 },
  },
  S: {
    1300: { top: 74, left: 49.8 },
    1100: { top: 70, left: 45 },
    900: { top: 66, left: 42 },
    768: { top: 60, left: 40 },
    500: { top: 55, left: 36 },
    400: { top: 50, left: 32 },
  },
  W: {
    1300: { top: 50.3, left: 21 },
    1100: { top: 46, left: 20 },
    900: { top: 44, left: 18 },
    768: { top: 42, left: 16 },
    500: { top: 40, left: 14 },
    400: { top: 38, left: 12 },
  },
};
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

const pedestrianPositions = {
  N: {
    1300: { first: { top: 25, left: -20 }, second: { top: 25, left: 150 } },
    1100: { first: { top: 20, left: -18 }, second: { top: 20, left: 140 } },
    900: { first: { top: 18, left: -15 }, second: { top: 18, left: 130 } },
    768: { first: { top: 16, left: -12 }, second: { top: 16, left: 120 } },
    500: { first: { top: 14, left: -10 }, second: { top: 14, left: 110 } },
    400: { first: { top: 12, left: -8 }, second: { top: 12, left: 100 } },
  },
  E: {
    1300: { first: { top: -20, left: -25 }, second: { top: 145, left: -25 } },
    1100: { first: { top: -18, left: -23 }, second: { top: 135, left: -23 } },
    900: { first: { top: -16, left: -21 }, second: { top: 125, left: -21 } },
    768: { first: { top: -14, left: -20 }, second: { top: 115, left: -20 } },
    500: { first: { top: -12, left: -18 }, second: { top: 105, left: -18 } },
    400: { first: { top: -10, left: -16 }, second: { top: 95, left: -16 } },
  },
  S: {
    1300: { first: { top: -25, left: -95 }, second: { top: -25, left: 73 } },
    1100: { first: { top: -23, left: -90 }, second: { top: -23, left: 68 } },
    900: { first: { top: -21, left: -85 }, second: { top: -21, left: 63 } },
    768: { first: { top: -19, left: -80 }, second: { top: -19, left: 58 } },
    500: { first: { top: -17, left: -75 }, second: { top: -17, left: 53 } },
    400: { first: { top: -15, left: -70 }, second: { top: -15, left: 48 } },
  },
  W: {
    1300: { first: { top: 70, left: 25 }, second: { top: -95, left: 25 } },
    1100: { first: { top: 65, left: 23 }, second: { top: -90, left: 23 } },
    900: { first: { top: 60, left: 21 }, second: { top: -85, left: 21 } },
    768: { first: { top: 55, left: 20 }, second: { top: -80, left: 20 } },
    500: { first: { top: 50, left: 18 }, second: { top: -75, left: 18 } },
    400: { first: { top: 45, left: 16 }, second: { top: -70, left: 16 } },
  },
};

const breakpoints = [1300, 1100, 900, 768, 500, 400];

const getResponsiveValue = <T,>(
  direction: "N" | "E" | "S" | "W",
  values: Record<"N" | "E" | "S" | "W", Record<number, T>>, // Updated type
  screenWidth: number
): T => {
  const closestBreakpoint = breakpoints.find((bp) => screenWidth <= bp) || 1300;
  return values[direction][closestBreakpoint];
};

const getOrientation = (
  direction: "N" | "E" | "S" | "W"
): "vertical" | "horizontal" => {
  return direction === "N" || direction === "S" ? "vertical" : "horizontal";
};

const FourWayIntersection = ({ editable }: { editable: boolean }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const {
    signals: trafficSignals,
    createdPatternPhasePreviewing,
    manualMode,
  } = useAppSelector((state) => state.signalConfig);

  // State to track the current screen width
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
