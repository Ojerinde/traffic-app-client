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

const initializeSignals = (
  signalString: string
): Record<"N" | "E" | "S" | "W", SignalState> => {
  const signals: Record<"N" | "E" | "S" | "W", SignalState> = {
    N: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
    E: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
    S: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
    W: { left: "R", straight: "R", right: "R", bike: "R", pedestrian: "R" },
  };

  const trimmedString = signalString.slice(1, -1);

  // Extract signals in blocks of 6 characters
  const signalBlocks = trimmedString.match(/.{6}/g);

  if (signalBlocks && signalBlocks.length === 4) {
    signalBlocks.forEach((signalBlock) => {
      const direction = signalBlock[0] as keyof typeof signals;

      signals[direction].left = signalBlock[1] as "R" | "A" | "G";
      signals[direction].straight = signalBlock[2] as "R" | "A" | "G";
      signals[direction].right = signalBlock[3] as "R" | "A" | "G";
      signals[direction].bike = signalBlock[4] as "R" | "A" | "G";
      signals[direction].pedestrian = signalBlock[5] as "R" | "A" | "G";
    });
  }

  return signals;
};

const initialConfig: SignalConfigState = {
  signals: initializeSignals("*NRRRRREGGGGRSGGGGRWRRRRR#"),
  warning: null,
  signalString: "*NRRRRREGGGGRSGGGGRWRRRRR#",
};

const signalConfigSlice = createSlice({
  name: "signalConfig",
  initialState: initialConfig,
  reducers: {
    setSignalString(state, action: PayloadAction<string>) {
      state.signalString = action.payload;
    },
    setSignalState(state) {
      state.signals = initializeSignals(state.signalString);
    },

    validateConfig(state) {},
  },
});

export const { setSignalState, setSignalString, validateConfig } =
  signalConfigSlice.actions;
export default signalConfigSlice.reducer;
