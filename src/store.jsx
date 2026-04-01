import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/base";

export const  store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  // DON'T FORGET THIS PART:
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})