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
  if (signalType === "straight" && newColor === "G") {
    if (direction === "N" || direction === "S") {
      if (eastSignal?.straight === "G" || westSignal?.straight === "G") {
        addConflict(
          "North/South straight conflicts with East/West straight movements."
        );
      }
    } else if (direction === "E" || direction === "W") {
      if (northSignal?.straight === "G" || southSignal?.straight === "G") {
        addConflict(
          "East/West straight conflicts with North/South straight movements."
        );
      }
    }
  }

  // Left Turn Conflicts
  if (signalType === "left" && newColor === "G") {
    if (direction === "N" || direction === "S") {
      if (eastSignal?.straight === "G" || westSignal?.straight === "G") {
        addConflict(
          "North/South left turns conflict with East/West straight movements."
        );
      }
    } else if (direction === "E" || direction === "W") {
      if (northSignal?.straight === "G" || southSignal?.straight === "G") {
        addConflict(
          "East/West left turns conflict with North/South straight movements."
        );
      }
    }
  }

  // Right Turn Conflicts and Continuous Right Turn Conflicts
  if (signalType === "right" && newColor === "G") {
    if (direction === "N" && westSignal?.left === "G") {
      addConflict("North Right conflicts with West Left.");
    }
    if (direction === "S" && eastSignal?.left === "G") {
      addConflict("South Right conflicts with East Left.");
    }
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

  // Additional Checks for Outright and Conditional Conflicts based on the comprehensive conflict matrix
  // North/South Left and Right Turn Conflicts with U-turns and opposite directions
  if (signalType === "left" && newColor === "G") {
    if (direction === "N" && southSignal?.left === "G") {
      addConflict("North Left conflicts with South Left.");
    }
    if (direction === "S" && northSignal?.left === "G") {
      addConflict("South Left conflicts with North Left.");
    }
  }

  return conflicts;
};
