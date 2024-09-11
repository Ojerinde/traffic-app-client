import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpRequest from "../services/HttpRequest";
import { emitToastMessage } from "@/utils/toastFunc";

interface InitialStateTypes {
  devices: any[];
  phases: any[];
  patterns: any[];
  isFetchingDevices: boolean;
  isFetchingPhases: boolean;
  isFetchingPatterns: boolean;
}
const initialState: InitialStateTypes = {
  devices: [],
  phases: [],
  patterns: [],
  isFetchingDevices: false,
  isFetchingPhases: false,
  isFetchingPatterns: false,
};

export const getUserDevice = createAsyncThunk(
  "userDevice/getUserDevice",
  async (email: string) => {
    try {
      const { data } = await HttpRequest.get(`/devices/${email}`);
      if (data.devices.length === 0) {
        return emitToastMessage("You have not added any device yet", "success");
      }
      emitToastMessage("Your device(s) are fetched successfully", "success");
      return data;
    } catch (error: any) {
      emitToastMessage("Could not fetch your device(s)", "error");
    }
  }
);

export const getUserPhase = createAsyncThunk(
  "userDevice/getUserPhase",
  async (email: string) => {
    try {
      const {
        data: { data },
      } = await HttpRequest.get(`/phases/${email}`);
      if (data.phases.length === 0) {
        return emitToastMessage("You have not added any phase yet", "success");
      }
      emitToastMessage("Your phase(s) are fetched successfully", "success");
      return data;
    } catch (error: any) {
      emitToastMessage("Could not fetch your phase(s)", "error");
    }
  }
);
export const getUserPattern = createAsyncThunk(
  "userDevice/getUserPattern",
  async (email: string) => {
    try {
      const {
        data: { data },
      } = await HttpRequest.get(`/patterns/${email}`);
      console.log("Email:", email, data);
      if (data.patterns.length === 0) {
        return emitToastMessage(
          "You have not added any pattern yet",
          "success"
        );
      }
      emitToastMessage("Your pattern(s) are fetched successfully", "success");
      return data;
    } catch (error: any) {
      emitToastMessage("Could not fetch your pattern(s)", "error");
    }
  }
);

const UserDeviceSlice = createSlice({
  name: "userDevice",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserDevice.pending, (state) => {
        state.isFetchingDevices = true;
      })
      .addCase(getUserDevice.fulfilled, (state, action) => {
        state.devices = action.payload.devices;
        state.isFetchingDevices = false;
      })
      .addCase(getUserDevice.rejected, (state) => {
        state.isFetchingDevices = false;
      })
      .addCase(getUserPhase.pending, (state) => {
        state.isFetchingPhases = true;
      })
      .addCase(getUserPhase.fulfilled, (state, action) => {
        state.phases = action.payload.phases;
        state.isFetchingPhases = false;
      })
      .addCase(getUserPhase.rejected, (state) => {
        state.isFetchingPhases = false;
      })
      .addCase(getUserPattern.pending, (state) => {
        state.isFetchingPatterns = true;
      })
      .addCase(getUserPattern.fulfilled, (state, action) => {
        state.patterns = action.payload.patterns;
        state.isFetchingPatterns = false;
      })
      .addCase(getUserPattern.rejected, (state) => {
        state.isFetchingPatterns = false;
      });
  },
});
export default UserDeviceSlice.reducer;
