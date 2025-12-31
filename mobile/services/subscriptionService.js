// Subscription service with hardcoded data
// TODO: Replace with actual API calls when backend is ready
import { getTranslation } from '../locales';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get subscription plans with translations
export const getSubscriptionPlans = async () => {
  return new Promise(async (resolve) => {
    // Get current language
    let language = 'fr';
    try {
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      if (savedLanguage) language = savedLanguage;
    } catch (error) {
      console.log('Error loading language:', error);
    }

    const t = getTranslation(language);
    
    const SUBSCRIPTION_PLANS = [
      {
        id: 1,
        name: t.subscription.monthlyPlan || 'Premium Mensuel',
        price: 29.99,
        currency: 'DT',
        duration: t.subscription.perMonth?.replace('/', '') || 'mois',
        features: [
          t.subscription.features?.unlimited || 'Accès illimité à toutes les histoires premium',
          t.subscription.features?.weekly || 'Nouvelles histoires chaque semaine',
          t.subscription.features?.offline || 'Mode hors ligne',
          t.subscription.features?.noAds || 'Sans publicité',
          t.subscription.features?.stats || 'Statistiques détaillées',
        ],
        popular: false,
      },
      {
        id: 2,
        name: t.subscription.annualPlan || 'Premium Annuel',
        price: 249.99,
        currency: 'DT',
        duration: t.subscription.perYear?.replace('/', '') || 'an',
        features: [
          t.subscription.features?.unlimited || 'Accès illimité à toutes les histoires premium',
          t.subscription.features?.weekly || 'Nouvelles histoires chaque semaine',
          t.subscription.features?.offline || 'Mode hors ligne',
          t.subscription.features?.noAds || 'Sans publicité',
          t.subscription.features?.stats || 'Statistiques détaillées',
          t.subscription.features?.savePercent || 'Économisez 33%',
        ],
        popular: true,
        popularText: t.subscription.popularBadge || 'Plus populaire',
        savings: t.subscription.annualSavings || '110 DT d\'économies',
      },
    ];

    setTimeout(() => {
      resolve(SUBSCRIPTION_PLANS);
    }, 300);
  });
};

// Hardcoded user subscription status
let USER_SUBSCRIPTION = {
  isSubscribed: false,
  planId: null,
  expiresAt: null,
  startedAt: null,
};

// Get user subscription status
export const getUserSubscription = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(USER_SUBSCRIPTION);
    }, 200);
  });
};

// Subscribe to a plan (mock)
export const subscribeToPlan = async (planId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (plan) {
        const startDate = new Date();
        const expiresAt = new Date();
        
        if (plan.duration === 'mois') {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        USER_SUBSCRIPTION = {
          isSubscribed: true,
          planId: planId,
          startedAt: startDate.toISOString(),
          expiresAt: expiresAt.toISOString(),
        };

        resolve({
          success: true,
          subscription: USER_SUBSCRIPTION,
        });
      } else {
        resolve({
          success: false,
          error: 'Plan not found',
        });
      }
    }, 1000);
  });
};

// Cancel subscription (mock)
export const cancelSubscription = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      USER_SUBSCRIPTION = {
        isSubscribed: false,
        planId: null,
        expiresAt: null,
        startedAt: null,
      };
      resolve({
        success: true,
      });
    }, 500);
  });
};

export default {
  getSubscriptionPlans,
  getUserSubscription,
  subscribeToPlan,
  cancelSubscription,
};
