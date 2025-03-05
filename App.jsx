import React, { useEffect } from "react";
import { TouchableOpacity, Image, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import store from "./screens/store/store";
import Orientation from "react-native-orientation-locker";

import MainScreen from "./screens/MainScreen";
import AudioGuideScreen from "./screens/AudioGuideScreen";
import RecommendedRouteScreen from "./screens/Recommend/RecommendedRouteScreen";
import MuseumMapScreen from "./screens/MuseumMapScreen";
import ExhibitionIntroScreen from "./screens/ExhibitionIntroScreen";
import PopularExhibitionScreen from "./screens/PopularExhibitionScreen";
import TargetSelectScreen from "./screens/Recommend/TargetSelectScreen";
import RouteResultScreen from "./screens/Recommend/RouteResultScreen";
import ExhibitionDetailScreen from "./screens/Recommend/ExhibitionDetail";

// Stack 네비게이터 생성
const Stack = createStackNavigator();

// 홈 아이콘 버튼
const HomeButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("Main")}
    style={{ paddingRight: 15 }}
  >
    <Icon name="home" size={28} color="#fff" />
  </TouchableOpacity>
);

// 홈 이미지 버튼
const HomeImageButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("Main")}
    style={{ paddingRight: 15 }}
  >
    <Image
      source={require("./assets/home.png")}
      style={{ width: 28, height: 28 }}
    />
  </TouchableOpacity>
);

export default function App() {
  useEffect(() => {
    // ✅ 앱이 시작될 때 세로모드 고정
    Orientation.lockToPortrait();

    // (선택) 필요시, 앱 종료 시 모든 방향 허용하도록 해제 가능
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={({ route, navigation }) => ({
            headerStyle: {
              backgroundColor: "#101322",
              height: Platform.OS === "ios" ? 110 : 80,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
            },
            headerLeftContainerStyle: {
              paddingLeft: 15,
            },
            headerRight: () => {
              const useImageButtonScreens = [
                "RecommendedRoute",
                "ExhibitionIntro",
              ];
              if (useImageButtonScreens.includes(route.name)) {
                return <HomeImageButton navigation={navigation} />;
              } else {
                return <HomeButton navigation={navigation} />;
              }
            },
          })}
        >
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AudioGuide"
            component={AudioGuideScreen}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="RecommendedRoute"
            component={RecommendedRouteScreen}
            options={{ title: "추천 동선" }}
          />
          <Stack.Screen
            name="TargetSelect"
            component={TargetSelectScreen}
            options={{ title: "관람 대상 선택" }}
          />
          <Stack.Screen
            name="RouteResult"
            component={RouteResultScreen}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="ExhibitionDetail"
            component={ExhibitionDetailScreen}
            options={{ title: " " }}
          />
          <Stack.Screen
            name="MuseumMap"
            component={MuseumMapScreen}
            options={{ title: "전시관 지도" }}
          />
          <Stack.Screen
            name="ExhibitionIntro"
            component={ExhibitionIntroScreen}
            options={{ title: "전시물 소개" }}
          />
          <Stack.Screen
            name="PopularExhibition"
            component={PopularExhibitionScreen}
            options={{ title: "인기 전시물" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
