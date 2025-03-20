import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import BleManager from "react-native-ble-manager";

const useBeaconScanner = () => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false); // 중복 실행 방지 플래그

  useEffect(() => {
    BleManager.start({ showAlert: false })
      .then(() => {
        if (Platform.OS === "android") {
          requestAndroidPermissions();
        }
      })
      .catch((error) => console.log("BLE Manager 초기화 실패:", error));
  }, []);

  const requestAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    } catch (error) {}
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
    if (isScanning) {
      console.log("⚠️ BLE 스캔이 이미 실행 중입니다. 중복 실행 방지됨.");
      return;
    }

    setIsScanning(true); // 스캔 시작 표시

    try {
      await BleManager.scan([], 13, true);

      setTimeout(async () => {
        try {
          const peripherals = await BleManager.getDiscoveredPeripherals([]);
          console.log("📡 검색된 비콘 목록:", peripherals);

          const giworksDevices = peripherals.map((device) => {
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
        } catch (error) {
        } finally {
          setIsScanning(false); // 스캔 종료 후 플래그 초기화
        }
      }, 15000); // 12초 후 결과 처리
    } catch (error) {
      setIsScanning(false); // 오류 발생 시에도 플래그 초기화
    }
  };

  return { devices, scanForDevices };
};

export default useBeaconScanner;
