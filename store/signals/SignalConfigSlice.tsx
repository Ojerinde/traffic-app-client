import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SignalState {
  left: "R" | "A" | "G" | "B";
  straight: "R" | "A" | "G" | "B";
  right: "R" | "A" | "G" | "B";
  bike: "R" | "G" | "A" | "B";
  pedestrian: "R" | "G" | "A" | "B";
}

interface SignalConfigState {
  signals: Record<"N" | "E" | "S" | "W", SignalState>;
  warning: string | null;
  signalString: string;
  allowConflictingConfig: false | true;
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
  const signalBlocks = trimmedString.match(/.{6}/g);

  if (signalBlocks && signalBlocks.length === 4) {
    signalBlocks.forEach((signalBlock) => {
      const direction = signalBlock[0] as keyof typeof signals;

      signals[direction].left = signalBlock[1] as "R" | "A" | "G" | "B";
      signals[direction].straight = signalBlock[2] as "R" | "A" | "G" | "B";
      signals[direction].right = signalBlock[3] as "R" | "A" | "G" | "B";
      signals[direction].bike = signalBlock[4] as "R" | "A" | "G" | "B";
      signals[direction].pedestrian = signalBlock[5] as "R" | "A" | "G" | "B";
    });
  }

  return signals;
};

const initialConfig: SignalConfigState = {
  signals: initializeSignals("*#"),
  warning: null,
  signalString: "*#",
  allowConflictingConfig: false,
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
    setSignalStringToAllRed(state) {
      state.signalString = "*NRRRRRERRRRRSRRRRRWRRRRR#";
    },
    setSignalStringToAllAmber(state) {
      state.signalString = "*NAAAAAEAAAAASAAAAAWAAAAA#";
    },
    setSignalStringToAllBlank(state) {
      state.signalString = "*NBBBBBEBBBBBSBBBBBWBBBBB#";
    },

    allowConflictConfig(state, action: PayloadAction<boolean>) {
      state.allowConflictingConfig = action.payload;
    },

    validateConfig(state) {},
  },
});

export const {
  setSignalState,
  setSignalString,
  setSignalStringToAllRed,
  setSignalStringToAllAmber,
  setSignalStringToAllBlank,
  allowConflictConfig,
  validateConfig,
} = signalConfigSlice.actions;
export default signalConfigSlice.reducer;
