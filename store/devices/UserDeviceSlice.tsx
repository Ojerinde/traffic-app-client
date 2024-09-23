import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpRequest from "../services/HttpRequest";
import { emitToastMessage } from "@/utils/toastFunc";

interface InitialStateTypes {
  devices: any[];
  phases: any[];
  patterns: any[];
  configuredPatterns: any[];
  configuredPhases: any[];
  isFetchingDevices: boolean;
  isFetchingPhases: boolean;
  isFetchingPatterns: boolean;
}
const initialState: InitialStateTypes = {
  devices: [],
  phases: [],
  patterns: [],
  configuredPatterns: [],
  configuredPhases: [],
  isFetchingDevices: false,
  isFetchingPhases: false,
  isFetchingPatterns: false,
};

export const getUserDevice = createAsyncThunk(
  "userDevice/getUserDevice",
  async (email: string) => {
    try {
      const { data } = await HttpRequest.get(`/devices/${email}`);
      // emitToastMessage("Your device(s) are fetched successfully", "success");
      return data;
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
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

      // emitToastMessage("Your phase(s) are fetched successfully", "success");
      return data;
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
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
      // emitToastMessage("Your pattern(s) are fetched successfully", "success");
      return data;
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
    }
  }
);

const UserDeviceSlice = createSlice({
  name: "userDevice",
  initialState: initialState,
  reducers: {
    // Groups Tab

    // Patterns Tab
    addOrUpdatePhaseConfig: (state, action) => {
      const { id, name, signalString, duration } = action.payload;
      const existingPhase = state.configuredPhases.find(
        (phase) => phase.id === id
      );

      if (existingPhase) {
        existingPhase.name = name;
        existingPhase.duration = duration;
        emitToastMessage(
          "Phase configuration has been updated successfully.",
          "success"
        );
      } else {
        state.configuredPhases.push({
          id,
          name,
          duration,
          signalString,
        });
        emitToastMessage(
          "Phase configuration has been added successfully.",
          "success"
        );
      }
    },

    removePhaseConfig: (state, action) => {
      const phaseIdToRemove = action.payload;
      state.configuredPhases = state.configuredPhases.filter(
        (phase) => phase.phaseId !== phaseIdToRemove
      );
      emitToastMessage(
        "Phase configuration has been removed successfully.",
        "success"
      );
    },
    clearPhaseConfig: (state) => {
      state.configuredPhases = [];
    },
  },
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
        state.phases = action.payload.phases.reverse();
        state.isFetchingPhases = false;
      })
      .addCase(getUserPhase.rejected, (state) => {
        state.isFetchingPhases = false;
      })
      .addCase(getUserPattern.pending, (state) => {
        state.isFetchingPatterns = true;
      })
      .addCase(getUserPattern.fulfilled, (state, action) => {
        state.patterns = action.payload.patterns.reverse();
        state.isFetchingPatterns = false;
      })
      .addCase(getUserPattern.rejected, (state) => {
        state.isFetchingPatterns = false;
      });
  },
});
export const { addOrUpdatePhaseConfig, removePhaseConfig, clearPhaseConfig } =
  UserDeviceSlice.actions;
export default UserDeviceSlice.reducer;
