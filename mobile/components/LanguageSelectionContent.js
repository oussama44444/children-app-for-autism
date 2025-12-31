import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

const LanguageSelectionContent = ({ navigation }) => {
  const { language, changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleContinue = async () => {
    await changeLanguage(selectedLanguage);
    navigation.replace('Login');
  };

  const languages = [
    {
      code: 'fr',
      name: 'Français',
      nativeName: 'Français',
      emoji: '🇫🇷',
      gradient: ['#0055A4', '#EF4135'],
    },
    {
      code: 'tn',
      name: 'Tunisian',
      nativeName: 'العربية التونسية',
      emoji: '🇹🇳',
      gradient: ['#E70013', '#C8102E'],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🌍</Text>
        <Text style={styles.title}>
          {language === 'fr' ? 'Choisir la langue' : 'اختار اللغة'}
        </Text>
      </View>

      {/* Language Options */}
      <View style={styles.languagesContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageCard,
              selectedLanguage === lang.code && styles.languageCardSelected,
            ]}
            onPress={() => setSelectedLanguage(lang.code)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                selectedLanguage === lang.code
                  ? lang.gradient
                  : ['#FFFFFF', '#F9FAFB']
              }
              style={styles.languageGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.languageContent}>
                <Text style={styles.languageEmoji}>{lang.emoji}</Text>
                <Text
                  style={[
                    styles.languageName,
                    selectedLanguage === lang.code && styles.languageNameSelected,
                  ]}
                >
                  {lang.nativeName}
                </Text>
                {selectedLanguage === lang.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#A855F7', '#EC4899']}
          style={styles.continueGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.continueText}>
            {language === 'fr' ? 'Continuer' : 'كمّل'} →
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  languagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 30,
  },
  languageCard: {
    width: 180,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  languageCardSelected: {
    borderColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOpacity: 0.3,
  },
  languageGradient: {
    padding: 20,
  },
  languageContent: {
    alignItems: 'center',
    position: 'relative',
  },
  languageEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  languageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  languageNameSelected: {
    color: '#FFFFFF',
  },
  checkmark: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 120,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default LanguageSelectionContent;
