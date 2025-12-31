import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';

const SubscriptionDetailsContent = ({ navigation }) => {
  const { subscription, unsubscribe } = useSubscription();
  const { language } = useLanguage();
  const t = getTranslation(language);
  const [cancelling, setCancelling] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const locale = language === 'fr' ? 'fr-FR' : 'ar-TN';
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      t.subscriptionDetails.cancel,
      t.subscriptionDetails.cancelMessage,
      [
        {
          text: t.subscriptionDetails.keepButton,
          style: 'cancel',
        },
        {
          text: t.subscriptionDetails.cancelButton,
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            const result = await unsubscribe();
            setCancelling(false);

            if (result.success) {
              Alert.alert(
                t.subscriptionDetails.cancelConfirm,
                t.subscriptionDetails.cancelMessage,
                [
                  {
                    text: t.common.ok,
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } else {
              Alert.alert(t.common.error, t.subscriptionDetails.cancelMessage);
            }
          },
        },
      ]
    );
  };

  const getPlanName = () => {
    if (subscription.planId === 1) return t.subscriptionDetails.monthlyPlan;
    if (subscription.planId === 2) return t.subscriptionDetails.annualPlan;
    return t.subscriptionDetails.premium;
  };

  const getPlanPrice = () => {
    if (subscription.planId === 1) return '29.99 DT/mois';
    if (subscription.planId === 2) return '249.99 DT/an';
    return 'N/A';
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
        <Text style={styles.headerTitle}>{t.subscriptionDetails.title}</Text>
      </View>

      {/* Premium Badge */}
      <View style={styles.premiumBadgeContainer}>
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00']}
          style={styles.premiumBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.crownIcon}>👑</Text>
          <Text style={styles.premiumTitle}>{t.subscriptionDetails.premiumActive}</Text>
          <Text style={styles.premiumSubtitle}>
            {t.subscriptionDetails.premiumSubtitle}
          </Text>
        </LinearGradient>
      </View>

      {/* Subscription Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>{t.subscriptionDetails.detailsTitle}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.subscriptionDetails.plan}</Text>
          <Text style={styles.detailValue}>{getPlanName()}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.subscriptionDetails.price}</Text>
          <Text style={styles.detailValue}>{getPlanPrice()}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.subscriptionDetails.startDate}</Text>
          <Text style={styles.detailValue}>
            {formatDate(subscription.startedAt)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.subscriptionDetails.renewalDate}</Text>
          <Text style={styles.detailValue}>
            {formatDate(subscription.expiresAt)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.subscriptionDetails.status}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>✓ {t.subscriptionDetails.active}</Text>
          </View>
        </View>
      </View>

      {/* Benefits */}
      <View style={styles.benefitsCard}>
        <Text style={styles.cardTitle}>{t.subscriptionDetails.benefitsTitle}</Text>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>✨</Text>
          <Text style={styles.benefitText}>{t.subscriptionDetails.unlimited}</Text>
        </View>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🎯</Text>
          <Text style={styles.benefitText}>{t.subscriptionDetails.exclusive}</Text>
        </View>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>📱</Text>
          <Text style={styles.benefitText}>{t.subscriptionDetails.offline}</Text>
        </View>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🚫</Text>
          <Text style={styles.benefitText}>{t.subscriptionDetails.noAds}</Text>
        </View>

        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>📊</Text>
          <Text style={styles.benefitText}>{t.subscriptionDetails.support}</Text>
        </View>
      </View>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancelSubscription}
        activeOpacity={0.8}
        disabled={cancelling}
      >
        <Text style={styles.cancelButtonText}>
          {cancelling ? t.subscriptionDetails.cancelling : t.subscriptionDetails.cancel}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        {t.subscriptionDetails.footer}
      </Text>
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
  premiumBadgeContainer: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  premiumBadge: {
    padding: 24,
    alignItems: 'center',
  },
  crownIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: '#1F2937',
    opacity: 0.8,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: 'bold',
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  cancelButton: {
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 16,
  },
});

export default SubscriptionDetailsContent;
