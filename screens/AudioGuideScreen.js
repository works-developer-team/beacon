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
    imageUrl:
      "http://gnscience.ktidc.kr/cmmn/fileView?path=/files/item/11/&physical=A73A21F22C0A4E6A8B1072330F8BFE8F.jpg",
    experience: [
      "매분 공이 하나씩 굴러가며 현재 시각을 표시합니다.",
      "매 5분마다 인형들이 나와서 공연을 합니다.",
      "뉴턴이 생각한 기계적으로 흐르는 시간 개념을 생각해 봅니다.",
    ],
    sciencePrinciple:
      "굴러가는 시간은 레일에 쌓인 공의 개수가 시간을 나타내어 시간이 기계적으로 흐른다고 생각한 뉴턴의 시간 개념을 이해하기 위한 전시물입니다.",
  },
  {
    id: "2",
    title: "카오스 진자",
    description: "다중 진자가 어떻게 움직이는지 관찰해 보세요.",
    imageUrl:
      "http://gnscience.ktidc.kr/cmmn/fileView?path=/files/item/11/&physical=A73A21F22C0A4E6A8B1072330F8BFE8F.jpg",
    experience: [
      "레버를 잡고 진자를 회전시킵니다.",
      "진자 운동의 규칙성과 불규칙성을 찾아 봅니다.",
    ],
    sciencePrinciple:
      "이중 진자나 삼중 진자는 단일 진자와 달리 진자의 초기 상태가 조금만 달라져도 전혀 다르게 움직입니다.\n" +
      "골프의 스윙은 이중 진자 운동입니다. 골프 스윙 중 자세가 약간만 틀어져도 공은 원래 의도한 것과 전혀 다르게 진행합니다.\n" +
      "다중 진자 운동을 비롯하여, 기상 변화나 지진 활동과 같이 복잡해서 직관적으로 이해할 수 없거나 장래를 예측할 수 없는 현상을 카오스 현상이라고 합니다.",
  },
  {
    id: "3",
    title: "테슬라 전기 실험",
    description: "테슬라 전기 실험입니다.",
    imageUrl:
      "http://gnscience.ktidc.kr/cmmn/fileView?path=/files/item/11/&physical=A73A21F22C0A4E6A8B1072330F8BFE8F.jpg",
    experience: [
      "레버를 잡고 진자를 회전시킵니다.",
      "진자 운동의 규칙성과 불규칙성을 찾아 봅니다.",
    ],
    sciencePrinciple:
      "이중 진자나 삼중 진자는 단일 진자와 달리 진자의 초기 상태가 조금만 달라져도 전혀 다르게 움직입니다. \n" +
      "골프의 스윙은 이중 진자 운동입니다. 골프 스윙 중 자세가 약간만 틀어져도 공은 원래 의도한 것과 전혀 다르게 진행합니다. \n" +
      "다중 진자 운동을 비롯하여, 기상 변화나 지진 활동과 같이 복잡해서 직관적으로 이해할 수 없거나 장래를 예측할 수 없는 현상을 카오스 현상이라고 합니다.\n",
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

      {/* 선택된 전시물의 메인 이미지 (상단 전체 너비) */}
      <Image
        source={{ uri: selectedExhibition.imageUrl }}
        style={styles.mainImage}
        resizeMode="cover"
      />

      {/* 상세정보 카드 (아래 영역) */}
      {/* 상세 정보 카드 */}
      <ScrollView
        style={styles.detailContainer}
        contentContainerStyle={{ paddingBottom: 30 }} // 하단 여유 공간 추가
      >
        <Text style={styles.detailTitle}>{selectedExhibition.title}</Text>
        <Text style={styles.detailDescription}>
          {selectedExhibition.description}
        </Text>

        {/* 체험 방법 */}
        <Text style={styles.sectionTitle}>체험 방법</Text>
        {selectedExhibition.experience?.map((step, index) => (
          <Text key={index} style={styles.experienceItem}>
            {index + 1}. {step}
          </Text>
        ))}

        {/* 과학 원리 */}
        <Text style={styles.sectionTitle}>과학원리</Text>
        {selectedExhibition.sciencePrinciple
          .split("\n")
          .map((paragraph, index) => (
            <Text key={index} style={styles.sciencePrinciple}>
              {paragraph}
            </Text>
          ))}
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  exhibitionList: {
    maxHeight: height * 0.3,
  },
  exhibitionItem: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedItem: {
    backgroundColor: "#666",
  },
  exhibitionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ✅ 메인 이미지 - 화면 너비 전체, 높이는 원하는 대로 조절 가능
  mainImage: {
    width: "100%",
    height: height * 0.3,
    borderRadius: 10,
    marginTop: -35,
    marginBottom: 0, // 여기서 marginBottom 제거
  },

  // ✅ 상세 카드 영역 - 이미지 살짝 덮기
  detailContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -40, // 이미지 위로 20px 올라와서 덮는 효과
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detailTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  detailDescription: {
    fontSize: 16,
    color: "#555",
    lineHeight: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  experienceItem: { fontSize: 14, color: "#555" },
  sciencePrinciple: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

export default AudioGuideScreen;
