import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/userContext';
import { useStories } from '../contexts/StoriesContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';
import StoryCard from './StoryCard';
import DashboardStats from './DashboardStats';
import StoryDetailsModal from './StoryDetailsModal';

const HomeContent = () => {
  const navigation = useNavigation();
  const { user, logout, token, getProfileAllData } = useUser();
  const { stories, completedStories, suggestedStories } = useStories();
  const { language } = useLanguage();
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [userName, setUserName] = useState(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''
  );
  const [loadingName, setLoadingName] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const appStateRef = useRef(AppState.currentState);

  // Fetch and log profile on mount and when app becomes active
  useEffect(() => {

    const fetchProfile = async () => {
      if (!token || !getProfileAllData) return;
      setLoadingName(true);
      try {
        const data = await getProfileAllData(token);
        console.log('Fetched user profile data (from context):', data);
        if (data && (data.firstName || data.lastName)) {
          const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          setUserName(fullName);
        }
      } catch (err) {
        console.error('Error fetching profile via context:', err);
      } finally {
        setLoadingName(false);
      }
    };

    fetchProfile();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        fetchProfile();
      }
      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, [token, ]);

  const currentStreak = 3;
  // prefer server truth for user points and completed stories; fall back to local stories state
  const userCompletedList = (user && (user.completedStories || user.completed_stories)) ? (user.completedStories || user.completed_stories) : null;
  const completedCount = userCompletedList ? userCompletedList.length : completedStories.length;
  const totalPoints = (user && typeof user.points === 'number')
    ? user.points
    : (completedStories.length * 10 + completedStories.reduce((sum, story) => sum + (story.points || 0), 0));

  // Enhance stories with hardcoded details
  const enhanceStoryWithDetails = (story) => ({
    ...story,
    points: story.points || 15,
    duration: story.duration || '5-10',
    ageRange: story.ageRange || '6-12',
    difficulty: story.difficulty || 'facile',
    objectives: story.objectives || (language === 'tn' 
      ? 'هذي الحكاية باش تعلّم الطفل مهارات التواصل و الفهم الاجتماعي من خلال مواقف حياتية ممتعة.'
      : 'Cette histoire aide votre enfant à développer des compétences de communication et de compréhension sociale à travers des situations amusantes de la vie quotidienne.'),
  });

  const handleStoryPress = (story) => {
    // If story is premium, prevent non-premium users from opening it
    if (story?.isPremium && !(user && user.isPremium)) {
      const title = language === 'fr' ? 'Contenu premium' : 'محتوى متميّز';
      const message = language === 'fr'
        ? "Cette histoire est réservée aux utilisateurs premium. Voulez-vous mettre à niveau ?"
        : 'هالحكاية للمشتركين المتميّزين فقط. تحب تطوّر اشتراكك؟';
      Alert.alert(
        title,
        message,
        [
          { text: language === 'fr' ? 'Annuler' : 'إلغاء', style: 'cancel' },
          { text: language === 'fr' ? 'Mettre à niveau' : 'طوّر الاشتراك', onPress: () => navigation.navigate('Subscription') }
        ]
      );
      return;
    }

    // navigate directly with the story id to avoid passing large objects
    navigation.navigate('StoryPlayer', { storyId: story?.id || story?._id });
  };

  const handleStartStory = () => {
    setIsModalVisible(false);
    // modal may have set `selectedStory` as an object; prefer id
    navigation.navigate('StoryPlayer', { storyId: selectedStory?.id || selectedStory?._id });
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedStory(null);
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.characterContainer}>
            <Text style={styles.character}>{user?.avatar || '🎭'}</Text>
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {t.home.greeting} {loadingName ? '...' : (userName?.split(' ')[0] || user?.name?.split(' ')[0] || '')} ! 👋
            </Text>
            <Text style={styles.subGreeting}>{t.home.subGreeting}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <DashboardStats 
        completedCount={completedCount}
        totalPoints={totalPoints}
        streak={currentStreak}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
          onPress={() => setActiveTab('suggestions')}
        >
          <Text style={styles.tabIcon}>✨</Text>
          <Text style={[styles.tabText, activeTab === 'suggestions' && styles.activeTabText]}>
            {t.home.suggestionsTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={styles.tabIcon}>⭐</Text>
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            {t.home.completedTab}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'suggestions' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>✨</Text>
            <Text style={styles.sectionTitle}>{t.home.recommendedTitle}</Text>
          </View>
          <Text style={styles.sectionSubtitle}>{t.home.recommendedSubtitle}</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContainer}
          >
                {suggestedStories
                  .filter(s => (s.difficulty || '').toString().toLowerCase() === 'easy')
                  .map(story => (
                    <View key={story.id} style={styles.storyCardWrapper}>
                      <StoryCard
                        story={story}
                        onPress={() => handleStoryPress(story)}
                        isLocked={story.isPremium && !(user && user.isPremium)} 
                      />
                    </View>
                ))}
          </ScrollView>
        </View>
      )}

      {activeTab === 'completed' && completedStories.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>⭐</Text>
            <Text style={styles.sectionTitle}>{t.home.completedTitle}</Text>
          </View>
          <Text style={styles.sectionSubtitle}>{t.home.completedSubtitle}</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContainer}
          >
            {completedStories.map(story => (
              <View key={story.id} style={styles.storyCardWrapper}>
                <StoryCard
                  story={story}
                  onPress={() => handleStoryPress(story)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.bottomPadding} />

      {/* Story Details Modal 
      <StoryDetailsModal
        visible={isModalVisible}
        story={selectedStory}
        onClose={handleCloseModal}
        onStart={handleStartStory}
      />
      */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#EC4899',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  character: {
    fontSize: 38,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  logoutButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#F3F4F6',
  },
  logoutIcon: {
    fontSize: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 3,
    borderColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#A855F7',
    borderColor: '#9333EA',
  },
  tabIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 24,
    marginBottom: 20,
    lineHeight: 20,
  },
  storiesContainer: {
    paddingHorizontal: 24,
  },
  storyCardWrapper: {
    width: 170,
    marginRight: 12,
  },
  bottomPadding: {
    height: 140,
  },
});

export default HomeContent;
