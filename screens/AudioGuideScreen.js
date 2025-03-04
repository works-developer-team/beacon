import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Dimensions,
} from "react-native";
import BleManager from "react-native-ble-manager";
import { useLazyGetExhibitionsByBeaconQuery } from "./api/exhibitionApi";

// 기본 목데이터
const mockExhibitions = [
  {
    id: "1",
    title: "굴러가는 시간",
    description: "공이 하나씩 굴러가며 현재 시간을 표시하는 전시물입니다.",
    imageUrl: "https://example.com/rolling-time.jpg",
  },
  {
    id: "2",
    title: "전자기 그네와 자석 발전기",
    description: "전자기와 자석의 원리를 직접 체험하는 전시물입니다.",
    imageUrl: "https://example.com/magnet-generator.jpg",
  },
];

const { height } = Dimensions.get("window"); // 화면 높이 가져오기

const AudioGuideScreen = () => {
  const [exhibitions, setExhibitions] = useState(mockExhibitions);
  const [selectedExhibition, setSelectedExhibition] = useState(
    mockExhibitions[0]
  ); // 초기값 설정 (첫 번째 전시물)

  const [getExhibitionsByBeacon] = useLazyGetExhibitionsByBeaconQuery();

  useEffect(() => {
    BleManager.start({ showAlert: false });
    if (Platform.OS === "android") requestAndroidPermissions();

    const interval = setInterval(scanForDevices, 30000);
    setTimeout(scanForDevices, 3000);

    return () => clearInterval(interval);
  }, []);

  const requestAndroidPermissions = async () => {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  };

  const scanForDevices = () => {
    BleManager.scan([], 60, true).catch(() => {
      console.log("❌ 스캔 실패");
      setExhibitions(mockExhibitions); // 실패 시 목데이터 유지
    });

    setTimeout(fetchDiscoveredDevices, 5000);
  };

  const fetchDiscoveredDevices = async () => {
    try {
      const peripherals = await BleManager.getDiscoveredPeripherals([]);
      const giworksDevices = peripherals
        .filter((device) => device.name?.startsWith("GIWORKS"))
        .map(parseDevice);

      if (giworksDevices.length > 0) {
        const closestDevice = giworksDevices.sort((a, b) => b.rssi - a.rssi)[0];

        const beaconData = {
          uuid: closestDevice.uuid,
          major: closestDevice.major,
          minor: closestDevice.minor,
        };

        console.log("📡 백엔드 전송 데이터:", beaconData);
        const { data } = await getExhibitionsByBeacon(beaconData);

        if (data?.exhibitions?.length > 0) {
          setExhibitions(data.exhibitions);
        } else {
          setExhibitions(mockExhibitions);
        }
        // ✅ 데이터 바뀌어도 기존 선택된 상세정보는 유지 (아무것도 안 함)
      } else {
        setExhibitions(mockExhibitions);
      }
    } catch (error) {
      console.error("❌ 장치 검색 중 오류 발생:", error);
      setExhibitions(mockExhibitions);
    }
  };

  const parseDevice = (device) => {
    const manufacturerData =
      device.advertising?.manufacturerData?.["004c"]?.bytes || [];
    if (manufacturerData.length < 23) return null;

    const uuid = [
      ...manufacturerData.slice(2, 6),
      ...manufacturerData.slice(6, 8),
      ...manufacturerData.slice(8, 10),
      ...manufacturerData.slice(10, 12),
      ...manufacturerData.slice(12, 18),
    ]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("-");

    return {
      name: device.name,
      id: device.id,
      rssi: device.rssi,
      uuid,
      major: (manufacturerData[18] << 8) + manufacturerData[19],
      minor: (manufacturerData[20] << 8) + manufacturerData[21],
    };
  };

  // 전시물 선택 시만 상세화면 업데이트
  const selectExhibition = (item) => {
    setSelectedExhibition(item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>전시관 안내</Text>

      {/* 전시물 리스트 */}
      <ScrollView style={styles.exhibitionList}>
        {exhibitions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.exhibitionItem,
              selectedExhibition?.id === item.id && styles.selectedItem,
            ]}
            onPress={() => selectExhibition(item)}
          >
            <Text style={styles.exhibitionTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 상세정보 영역 (남은 공간 전체 채우기) */}
      <View style={styles.detailContainer}>
        <Image
          source={{ uri: selectedExhibition.imageUrl }}
          style={styles.detailImage}
        />
        <Text style={styles.detailTitle}>{selectedExhibition.title}</Text>
        <Text style={styles.detailDescription}>
          {selectedExhibition.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101322",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 10 },

  exhibitionList: {
    maxHeight: height * 0.3, // 상단 리스트 영역 높이 제한 (화면 높이의 약 30%)
    marginBottom: 10,
  },

  exhibitionItem: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedItem: { backgroundColor: "#666" },
  exhibitionTitle: { color: "white", fontSize: 16, fontWeight: "bold" },

  detailContainer: {
    flex: 1, // 남은 영역을 모두 상세화면이 차지하도록
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    elevation: 5,
  },

  detailImage: {
    width: "100%",
    height: "50%",
    borderRadius: 10,
    marginBottom: 10,
  },
  detailTitle: { fontSize: 20, fontWeight: "bold" },
  detailDescription: { fontSize: 14, color: "#555", lineHeight: 20 },
});

export default AudioGuideScreen;
