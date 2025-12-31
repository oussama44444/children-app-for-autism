import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserSubscription, subscribeToPlan, cancelSubscription } from '../services/subscriptionService';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState({
    isSubscribed: false,
    planId: null,
    expiresAt: null,
    startedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscription status on mount
  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserSubscription();
      setSubscription(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (planId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await subscribeToPlan(planId);
      if (result.success) {
        setSubscription(result.subscription);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await cancelSubscription();
      if (result.success) {
        setSubscription({
          isSubscribed: false,
          planId: null,
          expiresAt: null,
          startedAt: null,
        });
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const isSubscriptionActive = () => {
    if (!subscription.isSubscribed) return false;
    if (!subscription.expiresAt) return false;
    
    const expiryDate = new Date(subscription.expiresAt);
    const now = new Date();
    return expiryDate > now;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        error,
        isSubscribed: isSubscriptionActive(),
        subscribe,
        unsubscribe,
        refreshSubscription: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
