import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStories } from '../contexts/StoriesContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';
import StoryCard from './StoryCard';
import PremiumModal from './PremiumModal';
import StoryDetailsModal from './StoryDetailsModal';

const StoriesListContent = () => {
  const navigation = useNavigation();
  const { stories } = useStories();
  const { isSubscribed } = useSubscription();
  const { language } = useLanguage();
  const t = getTranslation(language);
  const [filter, setFilter] = useState('all');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Use stories from backend (includes both free and premium)
  const allStories = useMemo(() => stories, [stories]);

  // Enhance stories with hardcoded details
  const enhanceStoryWithDetails = (story) => ({
    ...story,
    points: story.points || 15,
    duration: story.duration || '5-10',
    ageRange: story.ageRange || '6-12',
    difficulty: story.difficulty || (language === 'tn' ? 'ساهل' : 'facile'),
    objectives: story.objectives || (language === 'tn' 
      ? 'هذي الحكاية باش تعلّم الطفل مهارات التواصل و الفهم الاجتماعي من خلال مواقف حياتية ممتعة.'
      : 'Cette histoire aide votre enfant à développer des compétences de communication et de compréhension sociale à travers des situations amusantes de la vie quotidienne.'),
  });

  const handleStoryPress = (story) => {
    // Check if story is premium and user is not subscribed
    if (story.isPremium && !isSubscribed) {
      setShowPremiumModal(true);
      return;
    }

    const enhancedStory = enhanceStoryWithDetails(story);
    setSelectedStory(enhancedStory);
    setIsModalVisible(true);
  };

  const handleStartStory = () => {
    setIsModalVisible(false);
    navigation.navigate('StoryPlayer', { story: selectedStory });
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedStory(null);
  };

  const handleSubscribePress = () => {
    setShowPremiumModal(false);
    // Navigate to subscription screen
    navigation.navigate('Subscription');
  };

  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const filteredStories = allStories.filter(story => {
    if (filter === 'all') return true;
    if (filter === 'new') {
      if (!story.createdAt) return false;
      const created = new Date(story.createdAt).getTime();
      return (now - created) <= thirtyDaysMs;
    }
    if (filter === 'premium') return !!story.isPremium;
    if (filter === 'free') return !story.isPremium;
    return true;
  });

  const premiumStoriesCount = allStories.filter(s => !!s.isPremium).length;
  const freeStoriesCount = allStories.filter(s => !s.isPremium).length;
  const newStoriesCount = allStories.filter(s => {
    if (!s.createdAt) return false;
    const created = new Date(s.createdAt).getTime();
    return (now - created) <= thirtyDaysMs;
  }).length;

  return (
    <View style={styles.container}>
      {/* Header and Filters */}
      <View style={styles.headerRow}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📚 {t.stories.title}</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={styles.filterIcon}>🌟</Text>
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              {t.stories.all}
            </Text>
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{allStories.length}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'free' && styles.filterButtonActive]}
            onPress={() => setFilter('free')}
          >
            <Text style={styles.filterIcon}>🆓</Text>
            <Text style={[styles.filterText, filter === 'free' && styles.filterTextActive]}>
              {t.stories.free}
            </Text>
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{freeStoriesCount}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'new' && styles.filterButtonActive]}
            onPress={() => setFilter('new')}
          >
            <Text style={styles.filterIcon}>✨</Text>
            <Text style={[styles.filterText, filter === 'new' && styles.filterTextActive]}>
              {t.stories.new}
            </Text>
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{newStoriesCount}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'premium' && styles.filterButtonActive]}
            onPress={() => setFilter('premium')}
          >
            <Text style={styles.filterIcon}>👑</Text>
            <Text style={[styles.filterText, filter === 'premium' && styles.filterTextActive]}>
              {t.stories.premium}
            </Text>
            <View style={[styles.filterBadge, filter === 'premium' && styles.filterBadgePremium]}>
              <Text style={styles.filterBadgeText}>{premiumStoriesCount}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories List */}
      <ScrollView 
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        <View style={styles.cardsWrapper}>
          {filteredStories.map((story) => (
            <View key={story.id} style={styles.cardWrapper}>
              <StoryCard
                story={story}
                onPress={() => handleStoryPress(story)}
                isLocked={story.isPremium && !isSubscribed}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSubscribe={handleSubscribePress}
      />

      {/* Story Details Modal */}
      <StoryDetailsModal
        visible={isModalVisible}
        story={selectedStory}
        onClose={handleCloseModal}
        onStart={handleStartStory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  header: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#A855F7',
    borderColor: '#9333EA',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 7,
    marginLeft: 5,
  },
  filterBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterBadgePremium: {
    backgroundColor: '#FFD700',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  cardsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardWrapper: {
    width: '23%',
    marginBottom: 4,
  },
});

export default StoriesListContent;
