import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 전시물 데이터 조회용 API
export const exhibitionApi = createApi({
  reducerPath: "exhibitionApi", // RTK Query에서 이 API의 이름
  baseQuery: fetchBaseQuery({
    baseUrl: "https://your-backend-url.com/api", // 여기에 실제 백엔드 주소 입력
  }),
  endpoints: (builder) => ({
    // 비콘 데이터로 전시물 리스트 요청하는 API
    getExhibitionsByBeacon: builder.query({
      query: (beaconData) => ({
        url: "exhibitions", // 실제 엔드포인트 주소 (ex. /api/exhibitions)
        method: "POST", // POST 방식으로 비콘 정보 전송
        body: beaconData, // body에 비콘 데이터 (uuid, major, minor) 포함
      }),
    }),
  }),
});

// export할 훅
export const {
  useGetExhibitionsByBeaconQuery,
  useLazyGetExhibitionsByBeaconQuery,
} = exhibitionApi;
