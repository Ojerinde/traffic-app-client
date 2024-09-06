import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SignalState {
  left: "R" | "A" | "G";
  straight: "R" | "A" | "G";
  right: "R" | "A" | "G";
  bike: "R" | "G" | "A";
  pedestrian: "R" | "G" | "A";
}

interface SignalConfigState {
  signals: Record<"N" | "E" | "S" | "W", SignalState>;
  warning: string | null;
  signalString: string;
}

const initialConfig: SignalConfigState = {
  signals: {
    N: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
    E: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
    S: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
    W: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
  },
  warning: null,
  signalString: "*NRRRRREGGGGGSGGGGGWRRRRR#",
};

const signalConfigSlice = createSlice({
  name: "signalConfig",
  initialState: initialConfig,
  reducers: {
    setSignalString(state, action: PayloadAction<string>) {
      console.log("Updating signalString", action.payload);
      state.signalString = action.payload;
      console.log("Updated signalString", state.signalString);
    },
    setSignalState(state) {
      console.log("Updating signal", state.signalString);
      const trimmedString = state.signalString.slice(1, -1);

      // Extract signals in blocks of 6 characters
      const signals = trimmedString.match(/.{6}/g);

      if (signals && signals.length === 4) {
        signals.forEach((signalBlock) => {
          const direction = signalBlock[0]; // Get the first character as the direction (N, S, E, W)

          const dir = direction as keyof typeof state.signals;

          // Update the signal state for the corresponding direction
          state.signals[dir].left = signalBlock[1] as "R" | "A" | "G";
          state.signals[dir].straight = signalBlock[2] as "R" | "A" | "G";
          state.signals[dir].right = signalBlock[3] as "R" | "A" | "G";
          state.signals[dir].bike = signalBlock[4] as "R" | "A" | "G";
          state.signals[dir].pedestrian = signalBlock[5] as "R" | "A" | "G";
        });
      }
    },

    validateConfig(state) {},
  },
});

export const { setSignalState, setSignalString, validateConfig } =
  signalConfigSlice.actions;
export default signalConfigSlice.reducer;
