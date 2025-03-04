import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Image, 
  ImageBackground,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions
} from 'react-native';

const MainScreen = ({ navigation }) => {
  const [surveyModalVisible, setSurveyModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);

  // 화면 크기에 따른 조정
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 375;

  const menuItems = [
    {
      id: 1,
      title: '전시 해설',
      icon: require('../assets/main-01.png'),
      screen: 'AudioGuide'
    },
    {
      id: 3,
      title: '추천 동선',
      icon: require('../assets/main-03.png'),
      screen: 'RecommendedRoute'
    },
    {
      id: 4,
      title: '전시관 지도',
      icon: require('../assets/main-04.png'),
      screen: 'MuseumMap'
    },
    {
      id: 5,
      title: '전시물 소개',
      icon: require('../assets/main-05.png'),
      screen: 'ExhibitionIntro'
    },
  ];

  const handleSubmitSurvey = () => {
    // 여기에서 데이터 처리 로직 추가
    console.log('설문조사 제출:', { name, age, gender: selectedGender });
    
    // 모달 닫기 및 입력값 초기화
    setSurveyModalVisible(false);
    setName('');
    setAge('');
    setGender('');
    setSelectedGender(null);
    
    // 감사 메시지나 다음 단계로 이동할 수 있음
  };

  const renderSurveyModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={surveyModalVisible}
        onRequestClose={() => setSurveyModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.modalScrollView}>
                {/* 모달 헤더 */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>방문자 설문조사</Text>
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setSurveyModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                {/* 모달 내용 */}
                <View style={styles.modalContent}>
                  <Text style={styles.surveyIntro}>
                    과학탐구관 방문자 설문에 참여해 주셔서 감사합니다.
                    아래 정보를 입력해 주시면 서비스 개선에 큰 도움이 됩니다.
                  </Text>
                  
                  {/* 입력 폼 */}
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>이름</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="이름을 입력해 주세요"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>나이</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="나이를 입력해 주세요"
                      value={age}
                      onChangeText={setAge}
                      keyboardType="number-pad"
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>성별</Text>
                    <View style={styles.radioGroup}>
                      <TouchableOpacity 
                        style={[
                          styles.radioButton, 
                          selectedGender === '남성' && styles.radioButtonSelected
                        ]}
                        onPress={() => setSelectedGender('남성')}
                      >
                        <Text style={[
                          styles.radioText,
                          selectedGender === '남성' && styles.radioTextSelected
                        ]}>남성</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[
                          styles.radioButton, 
                          selectedGender === '여성' && styles.radioButtonSelected
                        ]}
                        onPress={() => setSelectedGender('여성')}
                      >
                        <Text style={[
                          styles.radioText,
                          selectedGender === '여성' && styles.radioTextSelected
                        ]}>여성</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                {/* 제출 버튼 */}
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleSubmitSurvey}
                >
                  <Text style={styles.submitButtonText}>제출하기</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

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
                    resizeMode="contain"
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.userButton}
            onPress={() => setSurveyModalVisible(true)}
          >
            <Text style={styles.userButtonText}>사용자 설문</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* 설문조사 모달 */}
      {renderSurveyModal()}
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
    paddingLeft: 5,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationContainer: {
    position: 'relative',
  },
  menuGrid: {
    paddingTop: 80,
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
    overflow: 'hidden',
    padding: 5,
  },
  menuItemContent: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    maxWidth: '70%',
  },
  menuText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
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
  
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalScrollView: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e3083',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  modalContent: {
    marginBottom: 20,
  },
  surveyIntro: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    width: '45%',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  radioButtonSelected: {
    borderColor: '#2e3083',
    backgroundColor: '#e8e8ff',
  },
  radioText: {
    fontSize: 16,
    color: '#666',
  },
  radioTextSelected: {
    color: '#2e3083',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2e3083',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default MainScreen;