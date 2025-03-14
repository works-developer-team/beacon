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
  Modal,
  Pressable,
} from "react-native";
import BleManager from "react-native-ble-manager";
import { useLazyGetExhibitionsByBeaconQuery } from "./api/exhibitionApi";

// 기본 목데이터
const mockExhibitions = [
  {
    id: "1",
    title: "굴러가는 시간",
    description: "공이 하나씩 굴러가며 현재 시간을 표시하는 전시물입니다.",
    imageUrl: "https://www.kosm.or.kr/images/sub/permanent_info03_img.png",
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
      "https://www.sciencecenter.go.kr/scipia/File/110062/CKEDITOR_ATTATCHMENTS/6015/6015.png",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2lEGHQooDfD-0WgNak4mNj_Wnp46MVULSZA&s",
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
  const [isImageModalVisible, setImageModalVisible] = useState(false); // 이미지 모달 상태
  console.log(isImageModalVisible);

  const [getExhibitionsByBeacon] = useLazyGetExhibitionsByBeaconQuery();

  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState("🔍 BLE 자동 감지 중...");

  useEffect(() => {
    BleManager.start({ showAlert: false });

    if (Platform.OS === "android") {
      requestAndroidPermissions();
    }

    // 📌 3초 후 자동 스캔 시작
    setTimeout(() => scanForDevices(), 3000);

    // 📌 30초마다 BLE 스캔 반복 실행 (지속 감지)
    const interval = setInterval(() => {
      scanForDevices();
    }, 30000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  // 📌 안드로이드 BLE 권한 요청
  const requestAndroidPermissions = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      console.log("✅ BLE 권한 허용됨");
    } catch (error) {
      console.log("❌ BLE 권한 요청 실패:", error);
    }
  };

  const parseIBeaconData = (device) => {
    if (!device.advertising || !device.advertising.manufacturerData) {
      console.log("❌ 광고 데이터 없음:", device);
      return { uuid: "N/A", major: "N/A", minor: "N/A" };
    }

    const manufacturerData = device.advertising.manufacturerData["004c"]; // Apple 제조사 ID (0x004C)
    if (!manufacturerData || !manufacturerData.bytes) {
      console.log(
        "❌ manufacturerData 없음:",
        device.advertising.manufacturerData
      );
      return { uuid: "N/A", major: "N/A", minor: "N/A" };
    }

    const bytes = manufacturerData.bytes;
    console.log(`📡 비콘 데이터 길이: ${bytes.length} 바이트`, bytes); // 데이터 길이 확인

    if (bytes.length >= 23) {
      // ✅ UUID (16바이트) 복호화
      const uuidParts = [
        bytes.slice(2, 6), // 첫 번째 부분 (4바이트)
        bytes.slice(6, 8), // 두 번째 부분 (2바이트)
        bytes.slice(8, 10), // 세 번째 부분 (2바이트)
        bytes.slice(10, 12), // 네 번째 부분 (2바이트)
        bytes.slice(12, 18), // 다섯 번째 부분 (6바이트)
      ];
      const uuid = uuidParts
        .map((part) =>
          part.map((b) => b.toString(16).padStart(2, "0")).join("")
        )
        .join("-");

      // ✅ Major (2바이트)
      const major = (bytes[18] << 8) | bytes[19];

      // ✅ Minor (2바이트)
      const minor = (bytes[20] << 8) | bytes[21];

      console.log(`🎯 UUID: ${uuid}, Major: ${major}, Minor: ${minor}`);
      return { uuid, major, minor };
    } else {
      console.log("❌ 데이터 길이 부족:", bytes);
    }

    return { uuid: "N/A", major: "N/A", minor: "N/A" };
  };

  // 📌 BLE 장치 스캔
  const scanForDevices = async () => {
    try {
      console.log("🚀 BLE 자동 감지 시작");
      setStatus("🔍 BLE 자동 감지 중...");

      BleManager.scan([], 60, true)
        .then(() => console.log("✅ 스캔 진행 중..."))
        .catch((error) => console.log("❌ 스캔 오류:", error));

      setTimeout(async () => {
        try {
          const peripherals = await BleManager.getDiscoveredPeripherals([]);
          console.log("🔎 전체 발견된 장치:", peripherals);

          peripherals.forEach((device) => {
            console.log(
              "📡 발견된 장치 상세 정보:",
              JSON.stringify(device, null, 2)
            );
          });

          const giworksDevices = peripherals
            .filter(
              (device) => device.name && device.name.startsWith("GIWORKS")
            )
            .map((device) => {
              const { uuid, major, minor } = parseIBeaconData(device);
              return {
                name: device.name,
                id: device.id,
                rssi: device.rssi,
                uuid,
                major,
                minor,
              };
            });

          console.log("🎯 GIWORKS 비콘:", giworksDevices);

          // 📌 상태 업데이트하여 화면 반영
          setDevices(giworksDevices);
          setStatus(`✅ 발견된 GIWORKS 비콘: ${giworksDevices.length}개`);
        } catch (error) {
          console.error("❌ BLE 목록 가져오기 오류:", error);
          setStatus("❌ BLE 목록 가져오기 실패");
        }
      }, 5000);
    } catch (error) {
      console.log("❌ 스캔 시작 오류:", error);
      setStatus("스캔 시작 오류 발생");
    }
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
      {/* 선택된 전시물의 메인 이미지 - 클릭 시 원본 보기 */}
      <TouchableOpacity
        onPress={() => {
          setImageModalVisible(true);
          console.log("모달 열림?", true);
        }}
      >
        <Image
          source={{ uri: selectedExhibition.imageUrl }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* 이미지 확대 모달 */}
      {/* 이미지 모달 */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          {/* 모달 닫기 버튼 */}
          <Pressable
            style={styles.modalBackground}
            onPress={() => setImageModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setImageModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: selectedExhibition.imageUrl }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>

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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "black",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  closeButton: {
    position: "absolute",
    top: 15, // 살짝 아래로
    right: 15, // 살짝 안쪽으로
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.7)", // 약간 투명한 배경
    paddingVertical: 10, // 터치 영역 확대
    paddingHorizontal: 15, // 터치 영역 확대
    borderRadius: 20, // 동글하게 만들어도 좋음
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24, // 글자 크기 키움
  },

  modalImage: {
    width: "100%",
    height: "100%",
  },
});

export default AudioGuideScreen;
