import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';
import { getSubscriptionPlans } from '../services/subscriptionService';

const SubscriptionContent = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const { subscribe } = useSubscription();
  const { language } = useLanguage();
  const t = getTranslation(language);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await getSubscriptionPlans();
      setPlans(data);
      // Pre-select the popular plan
      const popularPlan = data.find(p => p.popular);
      if (popularPlan) setSelectedPlanId(popularPlan.id);
    } catch (_error) {
      Alert.alert(t.common.error, t.subscription.errorLoadingPlans);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlanId) {
      Alert.alert(t.common.error, t.subscription.selectPlanError);
      return;
    }

    // Navigate to payment screen with selected plan
    navigation.navigate('Payment', { planId: selectedPlanId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>{t.subscription.title}</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>👑</Text>
        <Text style={styles.heroTitle}>{t.subscription.heroTitle}</Text>
        <Text style={styles.heroSubtitle}>
          {t.subscription.heroSubtitle}
        </Text>
      </View>

      {/* Benefits */}
      <View style={styles.benefitsContainer}>
        <BenefitItem icon="✨" text={t.subscription.benefits.unlimited} />
        <BenefitItem icon="🎯" text={t.subscription.benefits.exclusive} />
        <BenefitItem icon="📱" text={t.subscription.benefits.offline} />
        <BenefitItem icon="🚫" text={t.subscription.benefits.noAds} />
        <BenefitItem icon="📊" text={t.subscription.benefits.support} />
      </View>

      {/* Plans */}
      <View style={styles.plansContainer}>
        <Text style={styles.plansTitle}>{t.subscription.choosePlan}</Text>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlanId === plan.id}
            onSelect={() => setSelectedPlanId(plan.id)}
          />
        ))}
      </View>

      {/* Subscribe Button */}
      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={handleSubscribe}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#A855F7', '#9333EA']}
          style={styles.subscribeButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.subscribeButtonText}>
            {t.subscription.subscribe}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        {t.subscription.footer}
      </Text>
    </ScrollView>
  );
};

const BenefitItem = ({ icon, text }) => (
  <View style={styles.benefitItem}>
    <Text style={styles.benefitIcon}>{icon}</Text>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const PlanCard = ({ plan, selected, onSelect }) => (
  <TouchableOpacity
    style={[styles.planCard, selected && styles.planCardSelected]}
    onPress={onSelect}
    activeOpacity={0.7}
  >
    {plan.popular && (
      <View style={styles.popularBadge}>
        <Text style={styles.popularBadgeText}>⭐ {plan.popularText || 'Plus populaire'}</Text>
      </View>
    )}
    
    <View style={styles.planHeader}>
      <View>
        <Text style={[styles.planName, selected && styles.planNameSelected]}>
          {plan.name}
        </Text>
        {plan.savings && (
          <Text style={styles.planSavings}>{plan.savings}</Text>
        )}
      </View>
      <View style={styles.priceContainer}>
        <Text style={[styles.planPrice, selected && styles.planPriceSelected]}>
          {plan.price.toFixed(2)} DT
        </Text>
        <Text style={[styles.planDuration, selected && styles.planDurationSelected]}>
          /{plan.duration}
        </Text>
      </View>
    </View>

    <View style={styles.planFeatures}>
      {plan.features.map((feature, index) => (
        <View key={index} style={styles.featureRow}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={[styles.featureText, selected && styles.featureTextSelected]}>
            {feature}
          </Text>
        </View>
      ))}
    </View>

    <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
      {selected && <View style={styles.radioButtonInner} />}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  benefitsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 24,
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
    fontSize: 24,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
  },
  plansContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  plansTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#A855F7',
    backgroundColor: '#FAF5FF',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  planNameSelected: {
    color: '#A855F7',
  },
  planSavings: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  planPriceSelected: {
    color: '#A855F7',
  },
  planDuration: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  planDurationSelected: {
    color: '#A855F7',
  },
  planFeatures: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkIcon: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 8,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  featureTextSelected: {
    color: '#1F2937',
    fontWeight: '600',
  },
  radioButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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
  subscribeButton: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

export default SubscriptionContent;
