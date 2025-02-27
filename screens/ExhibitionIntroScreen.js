import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExhibitionIntroScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>전시물 소개</Text>
      <Text style={styles.description}>과학탐구관의 주요 전시물들을 소개합니다.</Text>
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

export default ExhibitionIntroScreen;