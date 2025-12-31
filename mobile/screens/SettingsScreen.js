import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SettingsContent from '../components/SettingsContent';

const SettingsScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#F3E8FF', '#FCE7F3', '#E0F2FE']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SettingsContent navigation={navigation} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default SettingsScreen;
