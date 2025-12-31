import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';

const SettingsContent = ({ navigation }) => {
  const { language, changeLanguage } = useLanguage();
  const t = getTranslation(language);

  const handleLanguageChange = async (newLanguage) => {
    await changeLanguage(newLanguage);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.settings?.title || 'Paramètres'}</Text>
      </View>

      {/* Language Setting */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings?.language || 'Langue'}</Text>
        
        {/* French Option */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            language === 'fr' && styles.optionCardSelected
          ]}
          onPress={() => handleLanguageChange('fr')}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionEmoji}>🇫🇷</Text>
            <View style={styles.optionTextContainer}>
              <Text style={[
                styles.optionTitle,
                language === 'fr' && styles.optionTitleSelected
              ]}>
                Français
              </Text>
              <Text style={styles.optionSubtitle}>French</Text>
            </View>
          </View>
          <View style={[
            styles.radioButton,
            language === 'fr' && styles.radioButtonSelected
          ]}>
            {language === 'fr' && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>

        {/* Tunisian Option */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            language === 'tn' && styles.optionCardSelected
          ]}
          onPress={() => handleLanguageChange('tn')}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionEmoji}>🇹🇳</Text>
            <View style={styles.optionTextContainer}>
              <Text style={[
                styles.optionTitle,
                language === 'tn' && styles.optionTitleSelected
              ]}>
                تونسي
              </Text>
              <Text style={styles.optionSubtitle}>Tunisian</Text>
            </View>
          </View>
          <View style={[
            styles.radioButton,
            language === 'tn' && styles.radioButtonSelected
          ]}>
            {language === 'tn' && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>
      </View>

      {/* Info Text */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          {t.settings?.languageInfo || 'Le changement de langue sera appliqué immédiatement à toute l\'application.'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 24,
    color: '#1F2937',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 16,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: '#A855F7',
    backgroundColor: '#FAF5FF',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: '#A855F7',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#A855F7',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#A855F7',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
});

export default SettingsContent;
