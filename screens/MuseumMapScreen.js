import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

// 지도 이미지 경로 (assets 폴더에 map.png 있어야 함)
const mapImage = require("../assets/map.png");

const { width, height } = Dimensions.get("window");

// 더미 현재 위치 좌표 (X, Y는 지도 이미지 위의 좌표 기준)
const dummyLocation = { x: 150, y: 300 }; // 여기는 테스트용, 실제 비콘 매칭 필요

const MuseumMapScreen = () => {
  const [currentPosition, setCurrentPosition] = useState(dummyLocation); // 기본값은 더미 위치

  useEffect(() => {
    // TODO: 비콘 데이터를 기반으로 위치 업데이트 로직 추가 가능
    // setCurrentPosition({ x: 새로운 x좌표, y: 새로운 y좌표 });
  }, []);

  return (
    <View style={styles.container}>
      {/* 전체 지도 이미지 */}
      <Image source={mapImage} style={styles.mapImage} />

      {/* 현재 위치 표시 (빨간 점) */}
      <View
        style={[
          styles.currentLocationMarker,
          {
            left: currentPosition.x,
            top: currentPosition.y,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#101322",
  },
  mapImage: {
    width: width,
    height: "100%",
    resizeMode: "contain",
  },
  currentLocationMarker: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "red",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
});

export default MuseumMapScreen;
