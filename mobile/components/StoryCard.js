import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const StoryCard = ({ story, onPress, isLocked = false }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.card, isLocked && styles.cardLocked]}>
        {/* TODO: BACKEND INTEGRATION - Replace with actual image */}
        <ImageBackground
          source={{ uri: story.imageUrl || 'https://via.placeholder.com/400x300' }}
          style={styles.imageBackground}
          imageStyle={styles.image}
        >
          <View style={[styles.overlay, isLocked && styles.overlayLocked]} />
          
          {isLocked && (
            <View style={styles.lockBadge}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
          
          {!isLocked && story.difficulty && (
            <View style={[
              styles.difficultyBadge, 
              { backgroundColor: story.difficulty === 'difficile' ? '#EF4444' : story.difficulty === 'moyen' ? '#F59E0B' : '#10B981' }
            ]}>
              <Text style={styles.difficultyText}>{story.difficulty}</Text>
            </View>
          )}
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.icon, isLocked && styles.iconLocked]}>{story.emoji}</Text>
            <Text style={[styles.title, isLocked && styles.titleLocked]} numberOfLines={2}>
              {story.title}
            </Text>
          </View>
          
          <Text style={[styles.description, isLocked && styles.descriptionLocked]} numberOfLines={2}>
            {story.description}
          </Text>

          <View style={styles.footer}>
            <Text style={[styles.category, isLocked && styles.categoryLocked]}>
              {story.category}
            </Text>
            {isLocked ? (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>👑 PREMIUM</Text>
              </View>
            ) : (
              <View style={styles.pointsContainer}>
                <Text style={styles.points}>{story.points} pts</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#F3F4F6',
  },
  imageBackground: {
    width: '100%',
    height: 110,
    justifyContent: 'flex-end',
  },
  image: {
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'lowercase',
  },
  content: {
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 28,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  category: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  pointsContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardLocked: {
    opacity: 0.85,
  },
  overlayLocked: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  lockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  lockIcon: {
    fontSize: 18,
  },
  iconLocked: {
    opacity: 0.7,
  },
  titleLocked: {
    color: '#6B7280',
  },
  descriptionLocked: {
    color: '#9CA3AF',
  },
  categoryLocked: {
    color: '#D1D5DB',
  },
  premiumBadge: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default StoryCard;
