import { configureStore } from "@reduxjs/toolkit";
import Esp32Reducer from "./esp32/Esp32Slice";

export const store = configureStore({
  reducer: {
    esp32: Esp32Reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
