import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';

const ProfileContent = ({ onLogout }) => {
  const { user } = useAuth();
  const { isSubscribed, subscription } = useSubscription();
  const navigation = useNavigation();
  const { language } = useLanguage();
  const t = getTranslation(language);

  const menuItems = [
    { label: t.profile.menu.editProfile, emoji: '✏️', action: 'edit' },
    { label: t.profile.menu.subscription, emoji: '👑', action: 'subscription', isPremium: true },
    { label: t.profile.menu.preferences, emoji: '⚙️', action: 'preferences' },
    { label: t.profile.menu.help, emoji: '❓', action: 'help' },
  ];

  const handleMenuPress = (action) => {
    if (action === 'subscription') {
      if (isSubscribed) {
        navigation.navigate('SubscriptionDetails');
      } else {
        navigation.navigate('Subscription');
      }
    } else if (action === 'edit') {
      navigation.navigate('EditProfile');
    } else if (action === 'help') {
      navigation.navigate('Help');
    } else if (action === 'preferences') {
      navigation.navigate('Settings');
    } else {
      // TODO: Implement navigation to each section
      console.log('Menu pressed:', action);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <LinearGradient
        colors={['#A855F7', '#EC4899', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#FFF', '#F3E8FF']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarEmoji}>🦁</Text>
            </LinearGradient>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarEmoji}>📷</Text>
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Petit Explorateur'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'explorer@sensaura.com'}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>⭐ {t.profile.level} 3 - {t.profile.adventurer}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>



      {/* Menu Section */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>{t.profile.title} 🏠</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.action)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[
                styles.menuEmojiContainer,
                item.isPremium && isSubscribed && styles.menuEmojiContainerPremium
              ]}>
                <Text style={styles.menuEmoji}>{item.emoji}</Text>
              </View>
              <View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.isPremium && isSubscribed && (
                  <Text style={styles.activeSubscriptionText}>Actif</Text>
                )}
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.logoutGradient}
        >
          <Text style={styles.logoutEmoji}>👋</Text>
          <Text style={styles.logoutText}>{t.profile.menu.logout}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  headerGradient: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  avatarEmoji: {
    fontSize: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editAvatarEmoji: {
    fontSize: 16,
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '31%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  menuContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuEmojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuEmoji: {
    fontSize: 20,
  },
  menuLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  menuEmojiContainerPremium: {
    backgroundColor: '#FEF3C7',
  },
  activeSubscriptionText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 2,
  },
  logoutButton: {
    width: '100%',
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logoutEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 20,
    width: '100%',
  },
});

export default ProfileContent;
