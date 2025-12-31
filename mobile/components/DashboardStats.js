import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';

const DashboardStats = ({ completedCount, totalPoints, streak }) => {
  const { language } = useLanguage();
  const t = getTranslation(language);
  return (
    <View style={styles.container}>
      <View style={[styles.statCard, { backgroundColor: '#FFFFFF' }]}>
        <View style={[styles.iconContainer, { backgroundColor: '#FFD700' }]}>
          <Text style={styles.icon}>🏆</Text>
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>{t.home.stats.totalPoints}</Text>
          <Text style={styles.statValue}>{totalPoints}</Text>
        </View>
      </View>

      <View style={[styles.statCard, { backgroundColor: '#FFFFFF' }]}>
        <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
          <Text style={styles.icon}>📚</Text>
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>{t.home.stats.completed}</Text>
          <Text style={styles.statValue}>{completedCount}</Text>
        </View>
      </View>

      <View style={[styles.statCard, { backgroundColor: '#FFFFFF' }]}>
        <View style={[styles.iconContainer, { backgroundColor: '#A855F7' }]}>
          <Text style={styles.icon}>📈</Text>
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>{t.home.stats.streak}</Text>
          <Text style={styles.statValue}>{streak} {t.home.stats.days}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  statCard: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#F9FAFB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  icon: {
    fontSize: 20,
  },
  statContent: {
    width: '100%',
  },
  statLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});

export default DashboardStats;
