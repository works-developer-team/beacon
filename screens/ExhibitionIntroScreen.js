import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const exhibitions = [
  {
    id: "1",
    category: "빛",
    title: "적외선 발견",
    imageUrl:
      "https://www.korea.kr/newsWeb/resources/attaches/000073/202108/39c6be96-66d5-4e57-bd3d-f0597f1bcb6a.png",
  },
  {
    id: "2",
    category: "빛",
    title: "자외선 카메라",
    imageUrl:
      "https://www.korea.kr/newsWeb/resources/attaches/000073/202108/39c6be96-66d5-4e57-bd3d-f0597f1bcb6a.png",
  },
  {
    id: "3",
    category: "빛",
    title: "적외선 카메라",
    imageUrl:
      "https://www.korea.kr/newsWeb/resources/attaches/000073/202108/39c6be96-66d5-4e57-bd3d-f0597f1bcb6a.png",
  },
  {
    id: "4",
    category: "땅",
    title: "지진파를 알면 내진설계가 보인다?",
    imageUrl:
      "https://www.korea.kr/newsWeb/resources/attaches/000073/202108/39c6be96-66d5-4e57-bd3d-f0597f1bcb6a.png",
  },
  {
    id: "5",
    category: "땅",
    title: "지각이 움직이면 어떤 일이 일어날까?",
    imageUrl:
      "https://www.korea.kr/newsWeb/resources/attaches/000073/202108/39c6be96-66d5-4e57-bd3d-f0597f1bcb6a.png",
  },
];

const ExhibitionIntroScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>추천 전시물</Text>
      <FlatList
        data={exhibitions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101322",
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#2c2f3b",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    overflow: "hidden",
  },
  itemContent: {
    flex: 1,
  },
  category: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginLeft: 10,
    opacity: 0.7, // 흐릿하게 보이도록
  },
});

export default ExhibitionIntroScreen;
