import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 추천 동선 관련 API 정의
export const recommendedRouteApi = createApi({
  reducerPath: "recommendedRouteApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://your-backend-url.com/api" }),
  endpoints: (builder) => ({
    getRecommendedRoute: builder.query({
      query: ({ time, target }) => ({
        url: `recommended-route`,
        method: "GET",
        params: { time, target },
      }),
    }),
  }),
});

// RTK Query 훅
export const { useGetRecommendedRouteQuery } = recommendedRouteApi;
