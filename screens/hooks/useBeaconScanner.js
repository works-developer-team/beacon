import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import BleManager from "react-native-ble-manager";

const useBeaconScanner = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    BleManager.start({ showAlert: false })
      .then(() => {
        console.log("✅ BLE Manager Started");
        if (Platform.OS === "android") {
          requestAndroidPermissions();
        }
      })
      .catch((error) => console.log("❌ BLE Manager 초기화 실패:", error));
  }, []);

  const requestAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      console.log("✅ BLE 권한 요청 결과:", granted);
    } catch (error) {
      console.log("❌ BLE 권한 요청 실패:", error);
    }
  };

  const parseIBeaconData = (device) => {
    if (!device.advertising || !device.advertising.manufacturerData) {
      return { uuid: "N/A", major: "N/A", minor: "N/A" };
    }

    const manufacturerData = device.advertising.manufacturerData["004c"];
    if (!manufacturerData || !manufacturerData.bytes) {
      return { uuid: "N/A", major: "N/A", minor: "N/A" };
    }

    const bytes = manufacturerData.bytes;
    if (bytes.length >= 23) {
      const uuidParts = [
        bytes.slice(2, 6),
        bytes.slice(6, 8),
        bytes.slice(8, 10),
        bytes.slice(10, 12),
        bytes.slice(12, 18),
      ];
      const uuid = uuidParts
        .map((part) =>
          part.map((b) => b.toString(16).padStart(2, "0")).join("")
        )
        .join("-");

      const major = (bytes[18] << 8) | bytes[19];
      const minor = (bytes[20] << 8) | bytes[21];

      return { uuid, major, minor };
    }
    return { uuid: "N/A", major: "N/A", minor: "N/A" };
  };

  const scanForDevices = async () => {
    try {
      console.log("🚀 BLE 스캔 시작");
      BleManager.scan([], 10, true)
        .then(() => console.log("✅ 스캔 진행 중..."))
        .catch((error) => console.log("❌ 스캔 오류:", error));

      setTimeout(async () => {
        try {
          const peripherals = await BleManager.getDiscoveredPeripherals([]);
          console.log("🔎 전체 발견된 장치:", peripherals);

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
          setDevices(giworksDevices);
          console.log("🎯 감지된 GIWORKS 비콘:", giworksDevices);
        } catch (error) {
          console.error("❌ BLE 목록 가져오기 실패", error);
        }
      }, 12000);
    } catch (error) {
      console.error("스캔 시작 오류 발생", error);
    }
  };

  return { devices, scanForDevices };
};

export default useBeaconScanner;
