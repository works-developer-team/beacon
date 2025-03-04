import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const RecommendedRouteScreen = ({ navigation }) => {
  // 시간 선택 시 바로 다음 화면으로 이동하는 함수
  const handleSelectTime = (time) => {
    navigation.navigate("TargetSelect", { selectedTime: time });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>관람시간을{"\n"}선택해주세요</Text>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleSelectTime("30분")}
      >
        <Text style={styles.optionText}>30분</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleSelectTime("1시간")}
      >
        <Text style={styles.optionText}>1시간</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#101322",
  },
  title: {
    width: "90%",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 30,
    color: "#fff",
  },
  optionButton: {
    padding: 15,
    width: "90%",
    marginVertical: 5,
    backgroundColor: "#25304a",
    borderRadius: 10,
    alignItems: "center",
  },
  optionText: { fontSize: 14, color: "#fff", fontWeight: "bold" },
});

export default RecommendedRouteScreen;
