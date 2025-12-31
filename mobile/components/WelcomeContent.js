import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';

const WelcomeContent = () => {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      {/* Main Welcome Icon */}
      <View style={styles.mainIconContainer}>
        <Text style={styles.mainEmoji}>📖</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{t.welcome.title}</Text>
      <Text style={styles.subtitle}>{t.welcome.subtitle}</Text>

    
    

    
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  mainIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#FFB6D9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 4,
    borderColor: '#FFC1E3',
  },
  mainEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 40,
  },
  featureBox: {
    width: 100,
    height: 110,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  featureEmoji: {
    fontSize: 45,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  message: {
    fontSize: 17,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default WelcomeContent;
