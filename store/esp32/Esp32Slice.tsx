import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateTypes {
  esp32: {
    batteryCapacity: string;
    batteryPercentage: string;
    isConnectedToInternet: boolean;
    isCharging: boolean;
    isFingerprintActive: boolean;
    location: string;
  };
}

const initialState: InitialStateTypes = {
  esp32: {
    batteryCapacity: "",
    batteryPercentage: "",
    isConnectedToInternet: false,
    isCharging: false,
    isFingerprintActive: false,
    location: "",
  },
};

const Esp32Slice = createSlice({
  name: "esp32",
  initialState,
  reducers: {
    AddEsp32Details: (state, action: PayloadAction<any>) => {
      state.esp32 = action.payload;
    },
  },
});
export const { AddEsp32Details } = Esp32Slice.actions;
export default Esp32Slice.reducer;
