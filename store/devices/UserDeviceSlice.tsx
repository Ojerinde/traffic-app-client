import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpRequest from "../services/HttpRequest";
import { emitToastMessage } from "@/utils/toastFunc";

interface InitialStateTypes {
  devices: any[];
  phases: any[];
  patterns: any[];
  groups: any[];
  configuredPatterns: any[];
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
export const getUserGroup = createAsyncThunk(
  "userDevice/getUserGroup",
  async (email: string) => {
    try {
      const {
        data: { data },
      } = await HttpRequest.get(`/groups/${email}`);
      if (data.length === 0) {
        return emitToastMessage("You have not added any group yet", "success");
      }
      emitToastMessage("Your group(s) are fetched successfully", "success");
      return data;
    } catch (error: any) {
      emitToastMessage("Could not fetch your group(s)", "error");
    }
  }
);

const UserDeviceSlice = createSlice({
  name: "userDevice",
  initialState: initialState,
  reducers: {
    addOrUpdatePatternConfig: (state, action) => {
      const { patternId, name, startTime, endTime, phases } = action.payload;
      const existingPattern = state.configuredPatterns.find(
        (p) => p.patternId === patternId
      );

      if (existingPattern) {
        existingPattern.startTime = startTime;
        existingPattern.name = name;
        existingPattern.endTime = endTime;
        existingPattern.phases = phases;
      } else {
        state.configuredPatterns.push({
          name,
          patternId,
          startTime,
          endTime,
          phases,
        });
      }
    },
    removePatternConfig: (state, action) => {
      const patternNameToRemove = action.payload;
      state.configuredPatterns = state.configuredPatterns.filter(
        (pattern) => pattern.name !== patternNameToRemove
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
      })
      .addCase(getUserGroup.pending, (state) => {
        state.isFetchingGroups = true;
      })
      .addCase(getUserGroup.fulfilled, (state, action) => {
        state.groups = action.payload;
        state.isFetchingGroups = false;
      })
      .addCase(getUserGroup.rejected, (state) => {
        state.isFetchingGroups = false;
      });
  },
});
export const { addOrUpdatePatternConfig, removePatternConfig } =
  UserDeviceSlice.actions;
export default UserDeviceSlice.reducer;
