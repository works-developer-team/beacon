import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AudioGuideScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>전시 해설</Text>
      <Text style={styles.description}>이곳에서 전시에 대한 오디오 해설을 들을 수 있습니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AudioGuideScreen;