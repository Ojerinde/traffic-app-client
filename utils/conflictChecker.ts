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

  // Helper function to add conflicts
  const addConflict = (message: string) => conflicts.push(message);

  // Straight Movement Conflicts
  if (
    (direction === "N" || direction === "S") &&
    signalType === "straight" &&
    newColor === "G" &&
    (northSignal?.straight === "G" || southSignal?.straight === "G")
  ) {
    addConflict("North and South cannot both have green straight signals.");
  }

  if (
    (direction === "E" || direction === "W") &&
    signalType === "straight" &&
    newColor === "G" &&
    (eastSignal?.straight === "G" || westSignal?.straight === "G")
  ) {
    addConflict("East and West cannot both have green straight signals.");
  }

  // Left Turn Conflicts
  if (
    (direction === "N" || direction === "S") &&
    signalType === "left" &&
    newColor === "G" &&
    (northSignal?.left === "G" || southSignal?.left === "G")
  ) {
    addConflict("North and South cannot both have green left-turn signals.");
  }

  if (
    (direction === "E" || direction === "W") &&
    signalType === "left" &&
    newColor === "G" &&
    (eastSignal?.left === "G" || westSignal?.left === "G")
  ) {
    addConflict("East and West cannot both have green left-turn signals.");
  }

  // Pedestrian Crossing Conflicts
  if (signalType === "pedestrian" && newColor === "G") {
    if (northSignal?.straight === "G" || southSignal?.straight === "G") {
      addConflict(
        "Pedestrian cannot cross when North or South has green straight signals."
      );
    }
    if (eastSignal?.straight === "G" || westSignal?.straight === "G") {
      addConflict(
        "Pedestrian cannot cross when East or West has green straight signals."
      );
    }
  }

  // Bicycle Lane Conflicts
  if (signalType === "bicycle" && newColor === "G") {
    if (
      northSignal?.straight === "G" ||
      southSignal?.straight === "G" ||
      eastSignal?.straight === "G" ||
      westSignal?.straight === "G"
    ) {
      addConflict(
        "Bicycles cannot cross when any straight signals from the opposite direction are green."
      );
    }
  }

  // U-Turn Conflicts
  if (signalType === "left" && newColor === "G") {
    if (oppositeDirection[direction] === "W" && westSignal?.right === "G") {
      addConflict(
        `Conflicting U-turn: ${direction} left conflicts with ${oppositeDirection[direction]} right.`
      );
    }
  }

  // Continuous Right Turn Conflicts
  if (signalType === "right" && newColor === "G") {
    if (direction === "N" && westSignal?.left === "G") {
      addConflict("North Right conflicts with West Left.");
    }
    if (direction === "S" && eastSignal?.left === "G") {
      addConflict("South Right conflicts with East Left.");
    }
  }

  // Additional Conflict Check for Outright and Conditional Conflicts
  if (
    (direction === "N" || direction === "S") &&
    signalType === "straight" &&
    newColor === "G" &&
    (eastSignal?.straight === "G" || westSignal?.straight === "G")
  ) {
    addConflict(
      "North/South straight conflicts with East/West straight movements."
    );
  }

  return conflicts;
};
