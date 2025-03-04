import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TargetSelectScreen = ({ route, navigation }) => {
  const { selectedTime } = route.params;
  const [selectedTarget, setSelectedTarget] = useState(null);

  // ✅ 선택 즉시 다음 화면으로 이동하는 함수
  const handleSelectTarget = (target) => {
    setSelectedTarget(target); // 선택된 값 저장 (선택 효과용)
    navigation.navigate("RouteResult", {
      selectedTime,
      selectedTarget: target,
    });
  };

  const targets = ["유아", "초등학생", "중고등학생", "성인"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>대상을{"\n"}선택해주세요</Text>
      {targets.map((target) => (
        <TouchableOpacity
          key={target}
          style={[styles.optionButton, selectedTarget === target]}
          onPress={() => handleSelectTarget(target)} // ✅ 바로 이동
        >
          <Text style={styles.optionText}>{target}</Text>
        </TouchableOpacity>
      ))}
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
  optionText: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default TargetSelectScreen;
