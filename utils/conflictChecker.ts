import { Signal } from "@/components/IntersectionComponent/Intersection";

export const checkForConflicts = (
  direction: "N" | "E" | "S" | "W",
  signalType: string,
  newColor: "R" | "A" | "G",
  signals: Signal[]
): string[] => {
  console.log("Checking for conflicts");
  const conflicts: string[] = [];

  // Map to get opposite direction
  const oppositeDirection: {
    [key in "N" | "E" | "S" | "W"]: "N" | "E" | "S" | "W";
  } = {
    N: "S",
    E: "W",
    S: "N",
    W: "E",
  };

  // Get the current signal state for each direction
  const northSignal = signals.find((signal) => signal.direction === "N");
  const southSignal = signals.find((signal) => signal.direction === "S");
  const eastSignal = signals.find((signal) => signal.direction === "E");
  const westSignal = signals.find((signal) => signal.direction === "W");

  // Rule 1: North-South straight conflict
  if (
    direction === "N" &&
    signalType === "straight" &&
    newColor === "G" &&
    southSignal?.straight === "G"
  ) {
    conflicts.push("North and South cannot both have green straight signals.");
  }
  if (
    direction === "S" &&
    signalType === "straight" &&
    newColor === "G" &&
    northSignal?.straight === "G"
  ) {
    conflicts.push("South and North cannot both have green straight signals.");
  }

  // Rule 2: East-West straight conflict
  if (
    direction === "E" &&
    signalType === "straight" &&
    newColor === "G" &&
    westSignal?.straight === "G"
  ) {
    conflicts.push("East and West cannot both have green straight signals.");
  }
  if (
    direction === "W" &&
    signalType === "straight" &&
    newColor === "G" &&
    eastSignal?.straight === "G"
  ) {
    conflicts.push("West and East cannot both have green straight signals.");
  }

  // Rule 3: Left-turn conflicts
  if (
    direction === "N" &&
    signalType === "left" &&
    newColor === "G" &&
    southSignal?.left === "G"
  ) {
    conflicts.push("North and South cannot both have green left-turn signals.");
  }
  if (
    direction === "S" &&
    signalType === "left" &&
    newColor === "G" &&
    northSignal?.left === "G"
  ) {
    conflicts.push("South and North cannot both have green left-turn signals.");
  }

  if (
    direction === "E" &&
    signalType === "left" &&
    newColor === "G" &&
    westSignal?.left === "G"
  ) {
    conflicts.push("East and West cannot both have green left-turn signals.");
  }
  if (
    direction === "W" &&
    signalType === "left" &&
    newColor === "G" &&
    eastSignal?.left === "G"
  ) {
    conflicts.push("West and East cannot both have green left-turn signals.");
  }

  // Rule 4: Pedestrian conflicts (example: pedestrians should not go when North or South is green)
  if (signalType === "pedestrian" && newColor === "G") {
    if (northSignal?.straight === "G" || southSignal?.straight === "G") {
      conflicts.push(
        "Pedestrian cannot cross when North or South has green straight signals."
      );
    }
    if (eastSignal?.straight === "G" || westSignal?.straight === "G") {
      conflicts.push(
        "Pedestrian cannot cross when East or West has green straight signals."
      );
    }
  }

  return conflicts;
};
