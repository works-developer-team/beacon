
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PopularExhibitionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>인기전시물 동선</Text>
      <Text style={styles.description}>과학탐구관을 효율적으로 관람할 수 있는 추천 동선입니다.</Text>
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

export default PopularExhibitionScreen;