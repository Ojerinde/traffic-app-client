import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpRequest from "../services/HttpRequest";
import { emitToastMessage } from "@/utils/toastFunc";

interface InitialStateTypes {
  devices: any[];
  phases: any[];
  patterns: any[];
  groups: any[];
  configuredPatterns: any[];
  configuredPhases: any[];
  isFetchingDevices: boolean;
  isFetchingPhases: boolean;
  isFetchingPatterns: boolean;
  isFetchingGroups: boolean;
}
const initialState: InitialStateTypes = {
  devices: [],
  phases: [],
  patterns: [],
  groups: [],
  configuredPatterns: [],
  configuredPhases: [],
  isFetchingDevices: false,
  isFetchingPhases: false,
  isFetchingPatterns: false,
  isFetchingGroups: false,
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
export const getUserGroup = createAsyncThunk(
  "userDevice/getUserGroup",
  async (email: string) => {
    try {
      const {
        data: { data },
      } = await HttpRequest.get(`/groups/${email}`);
      // emitToastMessage("Your group(s) are fetched successfully", "success");
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
    addOrUpdatePatternConfig: (state, action) => {
      const { name, startTime, endTime } = action.payload;
      const existingPattern = state.configuredPatterns.find(
        (p) => p.name === name
      );

      if (existingPattern) {
        existingPattern.startTime = startTime;
        existingPattern.name = name;
        existingPattern.endTime = endTime;
      } else {
        state.configuredPatterns.push({
          name,
          startTime,
          endTime,
        });
      }
    },
    removePatternConfig: (state, action) => {
      const patternNameToRemove = action.payload;
      state.configuredPatterns = state.configuredPatterns.filter(
        (pattern) => pattern.name !== patternNameToRemove
      );
    },
    // Patterns Tab
    addOrUpdatePhaseConfig: (state, action) => {
      const { phaseId, name, signalString, duration } = action.payload;
      const existingPhase = state.configuredPhases.find(
        (phase) => phase.phaseId === phaseId
      );

      if (existingPhase) {
        existingPhase.name = name;
        existingPhase.duration = duration;
      } else {
        state.configuredPhases.push({
          phaseId,
          name,
          duration,
          signalString,
        });
      }
    },
    removePhaseConfig: (state, action) => {
      const nameOfPhaseToRemove = action.payload;
      state.configuredPhases = state.configuredPhases.filter(
        (phase) =>
          phase.name.toLowerCase() !== nameOfPhaseToRemove.toLowerCase()
      );
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
      })
      .addCase(getUserGroup.pending, (state) => {
        state.isFetchingGroups = true;
      })
      .addCase(getUserGroup.fulfilled, (state, action) => {
        state.groups = action.payload.reverse();
        state.isFetchingGroups = false;
      })
      .addCase(getUserGroup.rejected, (state) => {
        state.isFetchingGroups = false;
      });
  },
});
export const {
  addOrUpdatePatternConfig,
  removePatternConfig,
  addOrUpdatePhaseConfig,
  removePhaseConfig,
} = UserDeviceSlice.actions;
export default UserDeviceSlice.reducer;
