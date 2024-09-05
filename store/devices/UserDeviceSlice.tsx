import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HttpRequest from "../services/HttpRequest";
import { emitToastMessage } from "@/utils/toastFunc";

interface InitialStateTypes {
  devices: any[];
  isFetchingDevices: boolean;
}
const initialState: InitialStateTypes = {
  devices: [],
  isFetchingDevices: false,
};

export const getUserDevice = createAsyncThunk(
  "userDevice/getUserDevice",
  async (email: string) => {
    try {
      const { data } = await HttpRequest.get(`/getDevice/${email}`);
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
        console.log("actions", action);
        state.devices = action.payload.devices;
        state.isFetchingDevices = false;
      })
      .addCase(getUserDevice.rejected, (state) => {
        state.isFetchingDevices = false;
      });
  },
});
export default UserDeviceSlice.reducer;
