import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';

const HelpContent = ({ navigation }) => {
  const { language } = useLanguage();
  const t = getTranslation(language);
  
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
        <Text style={styles.headerTitle}>{t.help.title}</Text>
      </View>

      {/* Welcome Section */}
      <View style={styles.section}>
        <View style={styles.iconContainer}>
          <Text style={styles.bigEmoji}>🌟</Text>
        </View>
        <Text style={styles.welcomeTitle}>{t.help.welcome}</Text>
        <Text style={styles.welcomeText}>
          {t.help.welcomeText}
        </Text>
      </View>

      {/* What is Sensaura */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎭 {t.help.whatIs}</Text>
        <Text style={styles.cardText}>
          {t.help.whatIsText}
        </Text>
        <Text style={styles.cardText}>
          {t.help.helps}
        </Text>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>💖</Text>
          <Text style={styles.bulletText}>{t.help.values}</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>🌈</Text>
          <Text style={styles.bulletText}>{t.help.behaviors}</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>🗣️</Text>
          <Text style={styles.bulletText}>{t.help.communication}</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>✨</Text>
          <Text style={styles.bulletText}>{t.help.fun}</Text>
        </View>
      </View>

      {/* How to use */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📚 {t.help.howItWorks}</Text>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.help.step1Title}</Text>
            <Text style={styles.stepText}>
              {t.help.step1Text}
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.help.step2Title}</Text>
            <Text style={styles.stepText}>
              {t.help.step2Text}
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.help.step3Title}</Text>
            <Text style={styles.stepText}>
              {t.help.step3Text}
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.help.step4Title}</Text>
            <Text style={styles.stepText}>
              {t.help.step4Text}
            </Text>
          </View>
        </View>
      </View>

      {/* Navigation Guide */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧭 {t.help.navigation}</Text>
        
        <View style={styles.navItem}>
          <Text style={styles.navEmoji}>🏠</Text>
          <View style={styles.navContent}>
            <Text style={styles.navTitle}>{t.help.homeTab}</Text>
            <Text style={styles.navText}>{t.help.homeText}</Text>
          </View>
        </View>

        <View style={styles.navItem}>
          <Text style={styles.navEmoji}>📚</Text>
          <View style={styles.navContent}>
            <Text style={styles.navTitle}>{t.help.storiesTab}</Text>
            <Text style={styles.navText}>{t.help.storiesText}</Text>
          </View>
        </View>

        <View style={styles.navItem}>
          <Text style={styles.navEmoji}>👤</Text>
          <View style={styles.navContent}>
            <Text style={styles.navTitle}>{t.help.profileTab}</Text>
            <Text style={styles.navText}>{t.help.profileText}</Text>
          </View>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 {t.help.tips}</Text>
        
        <View style={styles.tipItem}>
          <Text style={styles.tipEmoji}>🎯</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>{t.help.tip1} :</Text> {t.help.tip1Text}
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Text style={styles.tipEmoji}>🔁</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>{t.help.tip2} :</Text> {t.help.tip2Text}
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Text style={styles.tipEmoji}>👨‍👩‍👧</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>{t.help.tip3} :</Text> {t.help.tip3Text}
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Text style={styles.tipEmoji}>🎨</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>{t.help.tip4} :</Text> {t.help.tip4Text}
          </Text>
        </View>
      </View>

      {/* For Parents/Educators */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>👨‍👩‍👧 {t.help.forParents}</Text>
        <Text style={styles.infoText}>
          {t.help.parentsText}
        </Text>
        <Text style={styles.infoText}>
          {t.help.parentsText2}
        </Text>
        <Text style={styles.infoListItem}>• {t.help.social}</Text>
        <Text style={styles.infoListItem}>• {t.help.communication2}</Text>
        <Text style={styles.infoListItem}>• {t.help.autonomy}</Text>
        <Text style={styles.infoListItem}>• {t.help.emotions}</Text>
        <Text style={styles.infoText} style={[styles.infoText, { marginTop: 12 }]}>
          {t.help.recommended}
        </Text>
      </View>

      {/* Contact */}
      <View style={styles.contactCard}>
        <Text style={styles.contactEmoji}>💌</Text>
        <Text style={styles.contactTitle}>{t.help.needHelp}</Text>
        <Text style={styles.contactText}>
          {t.help.contact}
        </Text>
        <Text style={styles.contactEmail}>support@sensaura.com</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t.help.footer}</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
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
    paddingBottom: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 16,
  },
  section: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bigEmoji: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  navEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  navContent: {
    flex: 1,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  navText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  infoCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3730A3',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4338CA',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoListItem: {
    fontSize: 14,
    color: '#4338CA',
    lineHeight: 22,
    marginLeft: 8,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A855F7',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    color: '#D1D5DB',
  },
});

export default HelpContent;
