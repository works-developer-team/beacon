// import React, { useEffect } from "react";
// import { View, Text, FlatList, Image, StyleSheet } from "react-native";
// import { mapTimeToMinutes } from "../utils/mappingUtils";
// import { useGetRecommendedRouteQuery } from "../api/recommendedRouteApi";

// // 결과 화면
// const RouteResultScreen = ({ route }) => {
//   const { selectedTime, selectedTarget } = route.params;

//   // "30분" 또는 "1시간" -> 30, 60으로 변환
//   const timeInMinutes = mapTimeToMinutes(selectedTime);

//   // 백엔드 요청 (RTK Query 훅 사용)
//   const { data, error, isLoading } = useGetRecommendedRouteQuery({
//     time: timeInMinutes,
//     target: selectedTarget,
//   });

//   // 디버그용 - 요청 데이터 콘솔 확인
//   useEffect(() => {
//     console.log("전송 데이터:", {
//       time: timeInMinutes,
//       target: selectedTarget,
//     });
//   }, [timeInMinutes, selectedTarget]);

//   if (isLoading) {
//     return <Text style={styles.loading}>로딩 중...</Text>;
//   }

//   if (error) {
//     return (
//       <Text style={styles.error}>
//         데이터를 불러오는 중 오류가 발생했습니다.
//       </Text>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>추천 동선 결과</Text>
{
  /* <Image
  source={require("../../assets/map-sample.png")}
  style={styles.mapImage}
  resizeMode="contain"
/>; */
}
//       <FlatList
//         data={data?.recommendedList || []} // 데이터 없을 경우 빈 배열 처리
//         keyExtractor={(item) => item.id.toString()} // id 기준 키 설정
//         renderItem={({ item }) => (
//           <View style={styles.item}>
//             <Text style={styles.itemTitle}>{item.title}</Text>
//             <Text style={styles.itemDescription}>{item.description}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#101322", padding: 20 },
//   title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
//   mapImage: {
//     width: "100%",
//     height: 200,
//     marginBottom: 15,
//   },
//   item: {
//     padding: 20,
//     backgroundColor: "gray",
//     marginBottom: 10,
//     borderRadius: 10,
//   },
//   itemTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "rgba(255, 255, 255, 0.5)",
//     marginBottom: 3,
//   },
//   itemDescription: { fontSize: 16, color: "#fff", fontWeight: "bold" },
// });

// export default RouteResultScreen;
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { mapTimeToMinutes } from "../utils/mappingUtils";

// 실제로는 RTK Query에서 불러오지만, 지금은 백엔드가 없으므로 가짜 데이터로 대체
const mockRecommendedList = [
  {
    id: "1",
    title: "과학관 입구",
    description: "과학관의 시작을 알리는 장소",
    image: require("../../assets/detail.png"), // 이미지 경로 지정
  },
  {
    id: "2",
    title: "우주 전시관",
    description: "우주의 신비를 탐험하는 전시관",
  },
  {
    id: "3",
    title: "로봇 체험존",
    description: "로봇과 상호작용할 수 있는 체험존",
  },
  { id: "4", title: "기초 물리관", description: "물리 법칙을 배우는 공간" },
  {
    id: "5",
    title: "첨단 기술관",
    description: "최신 과학 기술을 체험하는 전시관",
  },
  {
    id: "6",
    title: "자연 탐구관",
    description: "자연의 경이로움을 발견하는 전시관",
  },
  {
    id: "7",
    title: "화학 실험실",
    description: "화학 반응을 직접 실험해보는 공간",
  },
  {
    id: "8",
    title: "미래도시 전시관",
    description: "미래의 도시를 상상하는 전시관",
  },
];

const RouteResultScreen = ({ route, navigation }) => {
  const { selectedTime, selectedTarget } = route.params;

  // 시간은 '30분' -> 30, '1시간' -> 60으로 변환
  const timeInMinutes = mapTimeToMinutes(selectedTime);

  // 실제로는 RTK Query로 데이터를 요청해야 하지만,
  // 지금은 백엔드가 없으므로 useState로 가짜 데이터를 저장
  const [recommendedList, setRecommendedList] = useState([]);

  useEffect(() => {
    // ✅ 콘솔에서 최종으로 백엔드에 보낼 값 확인
    console.log("전송 데이터:", {
      time: timeInMinutes,
      target: selectedTarget,
    });

    // ✅ 가짜 데이터 세팅 (실제 요청이 오면 여기서 데이터를 바꿔줌)
    setRecommendedList(mockRecommendedList);

    // 실제로는 아래처럼 RTK Query로 데이터를 불러오는 구조
    // const { data } = useGetRecommendedRouteQuery({ time: timeInMinutes, target: selectedTarget });
    // setRecommendedList(data?.recommendedList || []);
  }, [timeInMinutes, selectedTarget]);

  // 상세 페이지로 이동
  const goToDetail = (item) => {
    navigation.navigate("ExhibitionDetail", { item });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/map-sample.png")}
        style={styles.mapImage}
        resizeMode="contain"
      />

      <FlatList
        data={recommendedList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToDetail(item)}
            style={styles.item}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#101322", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  mapImage: {
    width: "100%",
    height: 200,
    marginBottom: 15,
  },
  item: {
    padding: 20,
    backgroundColor: "gray",
    marginBottom: 10,
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 3,
  },
  itemDescription: { fontSize: 16, color: "#fff", fontWeight: "bold" },
});

export default RouteResultScreen;
