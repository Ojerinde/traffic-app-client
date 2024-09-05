import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SignalState {
  left: "R" | "A" | "G";
  straight: "R" | "A" | "G";
  right: "R" | "A" | "G";
  bike: "R" | "G";
  pedestrian: "R" | "G";
}

interface SignalConfigState {
  signalString: string;
  signals: Record<"N" | "E" | "S" | "W", SignalState>;
  warning: string | null;
}

const initialConfig: SignalConfigState = {
  signalString: "*EGRARRWAAARGSGRARRNAAARG#",
  signals: {
    N: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
    E: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
    S: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
    W: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
  },
  warning: null,
};

const signalConfigSlice = createSlice({
  name: "signalConfig",
  initialState: initialConfig,
  reducers: {
    setSignalState(
      state,
      action: PayloadAction<{
        direction: "N" | "E" | "S" | "W";
        field: keyof SignalState;
        value: "R" | "A" | "G";
      }>
    ) {
      const { direction, field, value } = action.payload;

      if (field === "bike" || field === "pedestrian") {
        if (value !== "R" && value !== "G") {
          state.warning = `${field} can only be "R" (Red) or "G" (Green)`;
          return;
        }
      }

      state.signals[direction][field] = value;
    },

    validateConfig(state) {
      const greenStraight = Object.values(state.signals).filter(
        (config) => config.straight === "G"
      );
      const conflictingLeftRight = Object.values(state.signals).filter(
        (config) => config.left === "G" || config.right === "G"
      );

      // Check if more than one direction is straight green
      if (greenStraight.length > 1) {
        state.warning =
          "Only one direction can have a green straight signal at a time.";
      }
      // Check if conflicting left/right directions have green
      else if (conflictingLeftRight.length > 1) {
        state.warning =
          "Conflicting directions cannot have both left or right green signals.";
      } else {
        state.warning = null;
      }
    },

    setSignalString(state) {
      let signalString = "*";
      Object.keys(state.signals).forEach((direction) => {
        const config = state.signals[direction as "N" | "E" | "S" | "W"];
        signalString += `${direction}${config.left}${config.straight}${config.right}${config.bike}${config.pedestrian}`;
      });
      signalString += "#";
      state.signalString = signalString;
    },
  },
});

export const { setSignalState, validateConfig, setSignalString } =
  signalConfigSlice.actions;
export default signalConfigSlice.reducer;
