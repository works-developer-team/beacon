import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, ImageBackground } from 'react-native';

const MainScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: 1,
      title: '전시 해설',
      icon: require('../assets/main-01.png'), // PNG 이미지 경로
      screen: 'AudioGuide'
    },
    {
      id: 2,
      title: '예약',
      icon: require('../assets/main-02.png'), // PNG 이미지 경로
      screen: 'Reservation'
    },
    {
      id: 3,
      title: '추천 동선',
      icon: require('../assets/main-03.png'), // PNG 이미지 경로
      screen: 'RecommendedRoute'
    },
    {
      id: 4,
      title: '전시관 지도',
      icon: require('../assets/main-04.png'), // PNG 이미지 경로
      screen: 'MuseumMap'
    },
    {
      id: 5,
      title: '전시물 소개',
      icon: require('../assets/main-05.png'), // PNG 이미지 경로
      screen: 'ExhibitionIntro'
    },
    {
      id: 6,
      title: '인기 전시물',
      icon: require('../assets/main-06.png'), // PNG 이미지 경로
      screen: 'PopularExhibition'
    },
  ];

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#24225a" barStyle="light-content" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>과학탐구관 디지털 가이드</Text>
          <View style={styles.notificationContainer}>
          </View>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              {/* 카드 내부 레이아웃 컨테이너 */}
              <View style={styles.menuItemContent}>
                {/* 왼쪽 상단에 텍스트 배치 */}
                <View style={styles.textContainer}>
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>
                
                {/* 오른쪽 하단에 아이콘 배치 */}
                <View style={styles.iconContainer}>
                  <Image 
                    source={item.icon} 
                    style={styles.icon} 
                    resizeMode="contain" // 이미지 비율 유지하며 컨테이너에 맞춤
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.userButton}>
            <Text style={styles.userButtonText}>사용자설명</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationContainer: {
    position: 'relative',
  },
  menuGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    margin: 5,
  },
  menuItem: {
    width: '48%',
    height: 150,
    backgroundColor: '#2e3083',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden', // 내부 요소가 경계를 벗어나지 않도록
    padding: 5, // 내부 패딩 추가하여 여유 공간 확보
  },
  menuItemContent: {
    flex: 1,
    position: 'relative', // 자식 요소의 절대 위치 지정을 위함
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    maxWidth: '70%', // 텍스트가 너무 길지 않도록
  },
  menuText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 10, // 위로 약간 조정
    right: 10, // 왼쪽으로 약간 조정
    width: 50, // 너비 지정
    height: 50, // 높이 지정
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 16,
    borderTopColor: '#333180',
  },
  userButton: {
    backgroundColor: '#333180',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  userButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainScreen;