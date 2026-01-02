import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { fr } from '../locales/fr';
import { tn } from '../locales/tn';

const CongratulationsScreen = ({ onBackToHome, points }) => {
  const { language } = useLanguage();
  const t = language === 'fr' ? fr : tn;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.emojiRow}>
          <Text style={styles.emoji}>😊</Text>
          <Text style={styles.emoji}>🌟</Text>
          <Text style={styles.emoji}>😊</Text>
        </View>
        <Text style={styles.title}>{t.congratulations.title}</Text>
        <Text style={styles.message}>{t.congratulations.message}</Text>
        
        <View style={styles.pointsBox}>
          <Text style={styles.pointsValue}>+{points}</Text>
          <Text style={styles.pointsText}>{t.congratulations.points}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onBackToHome}>
          <Text style={styles.buttonText}>{t.congratulations.backToHome}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 4,
    borderColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    width: '85%',
    maxWidth: 300,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#2f4952',
    textAlign: 'center',
    marginBottom: 20,
  },
  pointsBox: {
    backgroundColor: '#FFD54F',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: '#F57C00',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  button: {
    backgroundColor: '#FF6B9D',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderColor: '#FF1493',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default CongratulationsScreen;
