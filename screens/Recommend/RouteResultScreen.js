import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";

// 추천 리스트 예시 데이터
const recommendedItems = [
  { id: "1", title: "과학관 입구", description: "과학관의 시작" },
  { id: "2", title: "우주 전시관", description: "우주의 신비 탐험" },
  { id: "3", title: "로봇 체험존", description: "로봇과의 만남" },
  { id: "4", title: "기초 물리관", description: "물리 법칙 이해" },
  { id: "5", title: "첨단 기술관", description: "최신 과학 기술" },
  { id: "6", title: "자연 탐구관", description: "자연의 경이" },
  { id: "7", title: "화학 실험실", description: "화학 반응 체험" },
  { id: "8", title: "미래도시 전시관", description: "미래사회 상상" },
];

const RouteResultScreen = ({ route }) => {
  const { selectedTime, selectedTarget } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/map-sample.png")}
        style={styles.mapImage}
        resizeMode="contain"
      />
      <FlatList
        data={recommendedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
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
