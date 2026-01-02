import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';

const StoryDetailsModal = ({ visible, story, onClose, onStart }) => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  if (!story) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'facile':
      case 'easy':
      case 'ساهل':
        return '#10B981';
      case 'moyen':
      case 'medium':
      case 'متوسط':
        return '#F59E0B';
      case 'difficile':
      case 'hard':
      case 'صعيب':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Story Image */}
            <ImageBackground
              source={{ uri: story.imageUrl || 'https://via.placeholder.com/400x300' }}
              style={styles.headerImage}
              imageStyle={styles.headerImageStyle}
            >
              <View style={styles.imageOverlay} />
              <View style={styles.headerContent}>
                <Text style={styles.emoji}>{story.emoji}</Text>
              </View>
            </ImageBackground>

            {/* Story Details */}
            <View style={styles.contentContainer}>
              {/* Title */}
              <Text style={styles.title}>{story.title}</Text>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.storyDetails.description}</Text>
                <Text style={styles.description}>{story.description}</Text>
              </View>

              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                {/* Difficulty */}
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>⚡</Text>
                  <Text style={styles.statLabel}>{t.storyDetails.difficulty}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(story.difficulty) }]}>
                    <Text style={styles.difficultyText}>{story.difficulty || t.storyDetails.easy}</Text>
                  </View>
                </View>

                {/* Points */}
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>⭐</Text>
                  <Text style={styles.statLabel}>{t.storyDetails.points}</Text>
                  <Text style={styles.statValue}>{story.points || 10} pts</Text>
                </View>

                {/* Duration */}
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>⏱️</Text>
                  <Text style={styles.statLabel}>{t.storyDetails.duration}</Text>
                  <Text style={styles.statValue}>{story.duration || '5-10'} min</Text>
                </View>

                {/* Age Range */}
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>👶</Text>
                  <Text style={styles.statLabel}>{t.storyDetails.ageRange}</Text>
                  <Text style={styles.statValue}>{story.ageRange || '6-12'} ans</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Start Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.startButton} onPress={onStart}>
              <Text style={styles.startButtonText}>{t.storyDetails.startButton}</Text>
              <Text style={styles.startButtonIcon}>🚀</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    marginTop: 0,
  },
  modalContainer: {
    backgroundColor: '#FFF9F0',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    marginTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerImage: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImageStyle: {
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  headerContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#FFE5EC',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  emoji: {
    fontSize: 70,
  },
  contentContainer: {
    padding: 28,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FF6B9D',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 44,
  },
  section: {
    marginBottom: 28,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 28,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 4,
    borderColor: '#FFE5EC',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF6B9D',
    marginBottom: 14,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#4B5563',
    lineHeight: 28,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    marginBottom: 0,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FFE5EC',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 140,
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 15,
    color: '#FF6B9D',
    marginBottom: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4B5563',
  },
  difficultyBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  footer: {
    padding: 28,
    paddingTop: 20,
    backgroundColor: '#FFF9F0',
  },
  startButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 28,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FFE5EC',
    transform: [{ scale: 1 }],
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginRight: 10,
    letterSpacing: 0.5,
  },
  startButtonIcon: {
    fontSize: 24,
  },
});

export default StoryDetailsModal;
