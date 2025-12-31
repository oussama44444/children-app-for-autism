import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import WelcomeContent from '../components/WelcomeContent';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';

const WelcomeScreen = ({ navigation }) => {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create floating animations
    const createFloatingAnimation = (animValue, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -15,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatingAnimation(floatAnim1, 2000).start();
    createFloatingAnimation(floatAnim2, 2500).start();
    createFloatingAnimation(floatAnim3, 3000).start();
  }, []);

  return (
    <LinearGradient
      colors={['#B4E7CE', '#FFC1E3', '#A7C7E7']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Floating Story Elements with animation */}
      <Animated.View 
        style={[
          styles.floatingEmoji, 
          { top: 30, left: 40, transform: [{ translateY: floatAnim1 }] }
        ]}
      >
        <Text style={styles.emojiText}>📚</Text>
      </Animated.View>
      <Animated.View 
        style={[
          styles.floatingEmoji, 
          { top: 80, right: 40, transform: [{ translateY: floatAnim2 }] }
        ]}
      >
        <Text style={styles.emojiText}>✨</Text>
      </Animated.View>
      <Animated.View 
        style={[
          styles.floatingEmoji, 
          { bottom: 120, left: 50, transform: [{ translateY: floatAnim3 }] }
        ]}
      >
        <Text style={styles.emojiText}>🌙</Text>
      </Animated.View>
      <Animated.View 
        style={[
          styles.floatingEmoji, 
          { bottom: 180, right: 30, transform: [{ translateY: floatAnim1 }] }
        ]}
      >
        <Text style={styles.emojiText}>⭐</Text>
      </Animated.View>
      <Animated.View 
        style={[
          styles.floatingEmoji, 
          { top: 150, left: 90, transform: [{ translateY: floatAnim2 }] }
        ]}
      >
        <Text style={styles.emojiText}>🎈</Text>
      </Animated.View>
      <Animated.View 
        style={[
          styles.floatingEmoji, 
          { top: 200, right: 80, transform: [{ translateY: floatAnim3 }] }
        ]}
      >
        <Text style={styles.emojiText}>🦋</Text>
      </Animated.View>

      <View style={styles.container}>
        <WelcomeContent />

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('LanguageSelection')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FFFFFF', '#FFF5F7']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              📖 {language === 'fr' ? "Commencer l'Histoire" : 'ابدا الحكاية'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 30,
  },
  floatingEmoji: {
    position: 'absolute',
    zIndex: 1,
  },
  emojiText: {
    fontSize: 36,
    opacity: 0.6,
  },
  welcomeTextContainer: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    width: '70%',
    marginTop: 15,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EC4899',
  },
});

export default WelcomeScreen;