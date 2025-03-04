import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { mapTargetToEnglish } from "../utils/mappingUtils";

const TargetSelectScreen = ({ route, navigation }) => {
  const { selectedTime } = route.params;

  const handleSelectTarget = (target) => {
    const englishTarget = mapTargetToEnglish(target);
    navigation.navigate("RouteResult", {
      selectedTime,
      selectedTarget: englishTarget,
    });
  };

  const targets = ["유아", "초등학생", "중고등학생", "성인"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>대상을{"\n"}선택해주세요</Text>
      {targets.map((target) => (
        <TouchableOpacity
          key={target}
          style={styles.optionButton}
          onPress={() => handleSelectTarget(target)}
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
