import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { exhibits } from "./data/exhibits";
import { sections } from "./data/sections";
import { useEffect, useState } from "react";
import useBeaconScanner from "./hooks/useBeaconScanner";

const mapImage = require("../assets/555.png"); // 지도 이미지

const mapOriginalWidth = 514; // 원본 이미지 가로 크기
const mapOriginalHeight = 1218; // 원본 이미지 세로 크기

const { width: screenWidth } = Dimensions.get("window");

// 섹션별 색상 가져오기
const getSectionColor = (section) => {
  const sectionData = sections.find((s) => s.id === section);
  return sectionData ? sectionData.color : "#FFFFFF";
};

const MuseumMapScreen = () => {
  const [currentPosition, setCurrentPosition] = useState({ x: 262, y: 609 });
  const [mapSize, setMapSize] = useState({
    width: screenWidth,
    height: (screenWidth / mapOriginalWidth) * mapOriginalHeight, // 비율 유지
  });

  const { scanForDevices, devices } = useBeaconScanner();

  // 지도 크기 업데이트 (onLayout 활용)
  const handleMapLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setMapSize({ width, height });
  };

  // 화면 크기에 맞춰 위치 변환 함수 (실제 지도 크기 기준)
  const getScaledPosition = (originalX, originalY) => ({
    x: (originalX / mapOriginalWidth) * mapSize.width,
    y: (originalY / mapOriginalHeight) * mapSize.height,
  });

  useEffect(() => {
    //  화면 진입 시 즉시 비콘 스캔 실행
    scanForDevices();

    // 10초마다 scanForDevices 실행
    const interval = setInterval(() => {
      scanForDevices();
    }, 10000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  useEffect(() => {
    if (devices.length === 0) return;

    // 📌 RSSI가 가장 강한 3개 비콘 선택
    const validBeacons = devices
      .map((device) => {
        if (!device.name) return null;

        // 정규식을 사용하여 A25(125) 같은 형식에서 "A25" 부분만 추출
        const match = device.name.match(/^([A-Z]+\d+)/);
        if (match) {
          const exhibitId = match[1]; // "A25"
          const exhibit = exhibits.find((ex) => ex.id === exhibitId);
          if (exhibit) {
            return { ...device, exhibit };
          }
        }
        return null;
      })
      .filter(Boolean) // null 값 제거
      .sort((a, b) => b.rssi - a.rssi) // RSSI 기준 정렬 (강한 신호 우선)
      .slice(0, 3); // 상위 3개 선택

    if (validBeacons.length < 2) return; // 최소 2개 비콘이 있어야 위치 계산 가능

    // 가장 강한 2개 비콘 선택
    const [strongest1, strongest2] = validBeacons;

    // 좌표 가져오기
    const pos1 = strongest1.exhibit;
    const pos2 = strongest2.exhibit;

    // RSSI에 가중치를 적용하여 두 좌표의 중간점에 위치 설정
    const weight1 = Math.abs(strongest1.rssi);
    const weight2 = Math.abs(strongest2.rssi);
    const totalWeight = weight1 + weight2;

    const avgX = (pos1.x * weight2 + pos2.x * weight1) / totalWeight;
    const avgY = (pos1.y * weight2 + pos2.y * weight1) / totalWeight;

    // 위치 업데이트
    setCurrentPosition({ x: avgX, y: avgY });
  }, [devices]);

  return (
    <View style={styles.container}>
      {/* 지도 이미지 배경 */}
      <Text style={styles.warningText}>
        ※ 비콘 성능과 기기에 따라 오차가 발생할 수 있습니다.
      </Text>
      <ImageBackground
        source={mapImage}
        style={[
          styles.mapImage,
          { width: mapSize.width, height: mapSize.height },
        ]}
        resizeMode="contain"
        onLayout={handleMapLayout} // 지도 크기 측정
      >
        {/* 전시물 마커 */}
        {exhibits.map((exhibit) => {
          const { x, y } = getScaledPosition(exhibit.x, exhibit.y);
          return (
            <TouchableOpacity
              key={exhibit.id}
              style={[
                styles.exhibitMarker,
                {
                  left: x - 6, // 마커 크기 보정 (중앙 정렬)
                  top: y - 6,
                  backgroundColor: getSectionColor(exhibit.section),
                },
              ]}
            />
          );
        })}

        {/* 현재 위치 표시 */}
        <View
          style={[
            styles.currentLocationMarker,
            {
              left:
                getScaledPosition(currentPosition.x, currentPosition.y).x - 10,
              top:
                getScaledPosition(currentPosition.x, currentPosition.y).y - 10,
            },
          ]}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  warningText: {
    position: "absolute",
    top: 0, // 화면 상단에 배치
    left: "45%",
    transform: [{ translateX: -100 }], // 가운데 정렬
    backgroundColor: "rgba(0,0,0,0.7)", // 반투명 배경 (가독성 향상)
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    zIndex: 10, // 다른 요소 위에 배치
  },
  container: {
    flex: 1,
    backgroundColor: "#101322",
    alignItems: "center",
    justifyContent: "center",
  },
  mapImage: {
    width: "100%",
    height: "auto",
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
  exhibitMarker: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
  },
});

export default MuseumMapScreen;
