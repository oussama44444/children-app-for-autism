import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SubscriptionDetailsContent from '../components/SubscriptionDetailsContent';

const SubscriptionDetailsScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#F3E8FF', '#FCE7F3', '#E0F2FE']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SubscriptionDetailsContent navigation={navigation} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default SubscriptionDetailsScreen;
