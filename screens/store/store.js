import { configureStore } from "@reduxjs/toolkit";
import { recommendedRouteApi } from "../api/recommendedRouteApi";

const store = configureStore({
  reducer: {
    [recommendedRouteApi.reducerPath]: recommendedRouteApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(recommendedRouteApi.middleware),
});

export default store;
