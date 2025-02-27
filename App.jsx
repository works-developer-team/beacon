import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import AudioGuideScreen from './screens/AudioGuideScreen';
import ReservationScreen from './screens/ReservationScreen';
import RecommendedRouteScreen from './screens/RecommendedRouteScreen';
import MuseumMapScreen from './screens/MuseumMapScreen';
import ExhibitionIntroScreen from './screens/ExhibitionIntroScreen';
import PopularExhibitionScreen from './screens/PopularExhibitionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#24225a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
      <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{ 
            headerShown: false // 홈 화면에서 네비게이션 바 숨기기
          }} 
        />
        <Stack.Screen 
          name="AudioGuide" 
          component={AudioGuideScreen} 
          options={{ title: '전시 해설' }} 
        />
        <Stack.Screen 
          name="Reservation" 
          component={ReservationScreen} 
          options={{ title: '예약' }} 
        />
        <Stack.Screen 
          name="RecommendedRoute" 
          component={RecommendedRouteScreen} 
          options={{ title: '추천 동선' }} 
        />
        <Stack.Screen 
          name="MuseumMap" 
          component={MuseumMapScreen} 
          options={{ title: '전시관 지도' }} 
        />
        <Stack.Screen 
          name="ExhibitionIntro" 
          component={ExhibitionIntroScreen} 
          options={{ title: '전시물 소개' }} 
        />
        <Stack.Screen 
          name="PopularExhibition" 
          component={PopularExhibitionScreen} 
          options={{ title: '인기 전시물' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}