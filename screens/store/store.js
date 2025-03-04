import { configureStore } from "@reduxjs/toolkit";
import { recommendedRouteApi } from "../api/recommendedRouteApi";
import { exhibitionApi } from "../api/exhibitionApi"; // 전시물 조회 API 추가

const store = configureStore({
  reducer: {
    [recommendedRouteApi.reducerPath]: recommendedRouteApi.reducer, // 추천 동선 API
    [exhibitionApi.reducerPath]: exhibitionApi.reducer, // 비콘 기반 전시물 API
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(recommendedRouteApi.middleware)
      .concat(exhibitionApi.middleware), // exhibitionApi 미들웨어 추가
});

export default store;
