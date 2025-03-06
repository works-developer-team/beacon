import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Text,
  ScrollView,
} from "react-native";
import BleManager from "react-native-ble-manager";

const MuseumMapScreen = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>전시관 지도</Text>
      <Text style={styles.description}>
        현재 위치를 기반으로 전시관 지도를 보여드립니다.
      </Text>

      <Text style={styles.status}>{status}</Text>

      {/* 📌 발견된 GIWORKS 비콘 목록 표시 */}
      <ScrollView style={styles.deviceList}>
        {devices.length === 0 ? (
          <Text style={styles.noDeviceText}>
            🔍 감지된 GIWORKS 비콘이 없습니다.
          </Text>
        ) : (
          devices.map((device, index) => (
            <View key={index} style={styles.deviceItem}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceId}>ID: {device.id}</Text>
              <Text style={styles.deviceRssi}>RSSI: {device.rssi} dBm</Text>
              <Text style={styles.uuid}>UUID: {device.uuid}</Text>
              <Text style={styles.major}>Major: {device.major}</Text>
              <Text style={styles.minor}>Minor: {device.minor}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
  deviceList: {
    marginTop: 20,
    width: "100%",
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceId: {
    fontSize: 14,
    color: "#666",
  },
  deviceRssi: {
    fontSize: 14,
    color: "#666",
  },
  uuid: {
    fontSize: 14,
    color: "#666",
  },
  major: {
    fontSize: 14,
    color: "#666",
  },
  minor: {
    fontSize: 14,
    color: "#666",
  },
  noDeviceText: {
    textAlign: "center",
    color: "#888",
  },
});

export default MuseumMapScreen;

// import React, { useEffect, useState } from "react";
// import { View, Image, StyleSheet, Dimensions } from "react-native";

// // 지도 이미지 경로 (assets 폴더에 map.png 있어야 함)
// const mapImage = require("../assets/map.png");

// const { width, height } = Dimensions.get("window");

// // 더미 현재 위치 좌표 (X, Y는 지도 이미지 위의 좌표 기준)
// const dummyLocation = { x: 150, y: 300 }; // 여기는 테스트용, 실제 비콘 매칭 필요

// const MuseumMapScreen = () => {
//   const [currentPosition, setCurrentPosition] = useState(dummyLocation); // 기본값은 더미 위치

//   useEffect(() => {
//     // TODO: 비콘 데이터를 기반으로 위치 업데이트 로직 추가 가능
//     // setCurrentPosition({ x: 새로운 x좌표, y: 새로운 y좌표 });
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* 전체 지도 이미지 */}
//       <Image source={mapImage} style={styles.mapImage} />

//       {/* 현재 위치 표시 (빨간 점) */}
//       <View
//         style={[
//           styles.currentLocationMarker,
//           {
//             left: currentPosition.x,
//             top: currentPosition.y,
//           },
//         ]}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: "relative",
//     backgroundColor: "#101322",
//   },
//   mapImage: {
//     width: width,
//     height: "100%",
//     resizeMode: "contain",
//   },
//   currentLocationMarker: {
//     position: "absolute",
//     width: 20,
//     height: 20,
//     backgroundColor: "red",
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "white",
//   },
// });

// export default MuseumMapScreen;
