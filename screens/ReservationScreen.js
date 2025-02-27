import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReservationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>예약</Text>
      <Text style={styles.description}>이곳에서 과학탐구관 관람 예약을 진행하실 수 있습니다.</Text>
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

export default ReservationScreen;
