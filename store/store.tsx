import { configureStore } from "@reduxjs/toolkit";
import adminDeviceReducer from "./devices/AdminDeviceSlice";
import userDeviceReducer from "./devices/UserDeviceSlice";

export const store = configureStore({
  reducer: {
    adminDevice: adminDeviceReducer,
    userDevice: userDeviceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
