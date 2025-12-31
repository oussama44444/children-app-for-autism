import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';

const PaymentForm = ({ navigation, route }) => {
  const { planId } = route.params || {};
  const { subscribe } = useSubscription();
  const { language } = useLanguage();
  const t = getTranslation(language);
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handlePayment = async () => {
    // Validation
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      Alert.alert(t.common.error, t.payment.allFieldsRequired);
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert(t.common.error, t.payment.errors.cardNumber);
      return;
    }

    if (cvv.length !== 3) {
      Alert.alert(t.common.error, t.payment.errors.cvv);
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      const result = await subscribe(planId);
      setProcessing(false);

      if (result.success) {
        Alert.alert(
          t.payment.successTitle,
          t.payment.successMessage,
          [
            {
              text: t.payment.start,
              onPress: () => {
                navigation.navigate('Main');
              },
            },
          ]
        );
      } else {
        Alert.alert(t.common.error, t.payment.failureMessage);
      }
    }, 2000);
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
        <Text style={styles.headerTitle}>{t.payment.title}</Text>
      </View>

      {/* Security Badge */}
      <View style={styles.securityBadge}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          {t.payment.securePayment}
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Card Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.payment.cardNumber}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.payment.cardNumberPlaceholder}
            placeholderTextColor="#9CA3AF"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            keyboardType="numeric"
            maxLength={19}
          />
        </View>

        {/* Card Holder */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.payment.cardHolder}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.payment.cardHolderPlaceholder}
            placeholderTextColor="#9CA3AF"
            value={cardHolder}
            onChangeText={setCardHolder}
            autoCapitalize="characters"
          />
        </View>

        {/* Expiry and CVV */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>{t.payment.expiry}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.payment.expiryPlaceholder}
              placeholderTextColor="#9CA3AF"
              value={expiryDate}
              onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>{t.payment.cvv}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.payment.cvvPlaceholder}
              placeholderTextColor="#9CA3AF"
              value={cvv}
              onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>
      </View>

      {/* Payment Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        activeOpacity={0.8}
        disabled={processing}
      >
        <LinearGradient
          colors={processing ? ['#9CA3AF', '#6B7280'] : ['#10B981', '#059669']}
          style={styles.payButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.payButtonText}>
            {processing ? t.payment.processing : t.payment.pay}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Info Text */}
      <Text style={styles.infoText}>
        {t.payment.termsText}
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
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D1FAE5',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  securityText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '700',
  },
  form: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  payButton: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  payButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 16,
  },
});

export default PaymentForm;
