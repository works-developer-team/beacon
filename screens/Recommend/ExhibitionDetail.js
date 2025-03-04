import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const ExhibitionDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      {/* 상단 이미지 영역 */}
      <Image source={item.image} style={styles.image} resizeMode="cover" />

      {/* 상세 설명 영역 */}
      <View style={styles.detailContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.sectionTitle}>체험 방법</Text>
        <Text style={styles.description}>
          1️⃣ 매분 공이 하나씩 굴러가며 현재 시각을 표시하는 숫자를 확인합니다.
          {"\n"}2️⃣ 매 5분마다 인형들이 나와서 공연을 합니다.
          {"\n"}3️⃣ 뉴턴이 생각한 기계적으로 흐르는 시간 개념을 생각해 봅니다.
        </Text>

        <Text style={styles.sectionTitle}>과학원리</Text>
        <Text style={styles.description}>
          굴러가는 시간은 레일에 쌓인 공의 개수가 시간을 나타내어 (왼쪽줄은 1분,
          중간줄은 5분, 아래줄은 1시간) 시간이 기계적으로 흐른다고 생각한 뉴턴의
          시간 개념을 이해하기 위한 전시물입니다.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 250 },
  detailContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  description: { fontSize: 14, color: "#555", lineHeight: 22 },
  homeButton: {
    backgroundColor: "#101322",
    padding: 15,
    alignItems: "center",
    margin: 20,
    borderRadius: 10,
  },
  homeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default ExhibitionDetailScreen;
