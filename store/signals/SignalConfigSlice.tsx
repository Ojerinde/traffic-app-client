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
}

const initialConfig: SignalConfigState = {
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
      action: PayloadAction<string> // Payload is the full signal string like "*EGRARRWAAARGSGRARRNAAARG#"
    ) {
      const signalString = action.payload;

      const trimmedString = signalString.slice(1, -1);

      const signals = trimmedString.match(/.{6}/g);

      if (signals && signals.length === 4) {
        const directions = ["E", "W", "S", "N"];

        directions.forEach((direction, index) => {
          const signalBlock = signals[index];
          const dir = direction as keyof typeof state.signals;

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

export const { setSignalState, validateConfig } = signalConfigSlice.actions;
export default signalConfigSlice.reducer;
