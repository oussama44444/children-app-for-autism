import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';

const RegisterForm = ({ onSubmit, loading, error, clearError, navigation, onValidationError }) => {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    clearError();
  };

  const handleRegister = () => {
    Keyboard.dismiss();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      if (onValidationError) {
        onValidationError(language === 'fr' ? 'Veuillez remplir tous les champs' : 'املا جميع الحقول');
      }
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      if (onValidationError) {
        onValidationError(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'كلمة السر ماتطابقش');
      }
      return;
    }

    if (formData.password.length < 6) {
      if (onValidationError) {
        onValidationError(language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères' : 'كلمة السر لازم 6 حروف على الأقل');
      }
      return;
    }

    onSubmit({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formContainer}>
        {/* Smiley Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>🎨</Text>
        </View>

        <Text style={styles.title}>{t.register.title}</Text>
        <Text style={styles.subtitle}>{t.register.subtitle}</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.label}>{t.register.name}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.register.namePlaceholder}
          placeholderTextColor="#B8B8D1"
          value={formData.firstName}
          onChangeText={(text) => updateField('firstName', text)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>{language === 'fr' ? 'Nom de famille' : 'اللقب'}</Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'fr' ? 'Ton nom de famille...' : 'لقبك...'}
          placeholderTextColor="#B8B8D1"
          value={formData.lastName}
          onChangeText={(text) => updateField('lastName', text)}
          autoCapitalize="words"
        />

        <Text style={styles.label}>{t.register.email}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.register.emailPlaceholder}
          placeholderTextColor="#B8B8D1"
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>{t.register.password}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder={t.register.passwordPlaceholder}
            placeholderTextColor="#B8B8D1"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '👀' : '😌'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirme le Code</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Répète ton code secret..."
            placeholderTextColor="#B8B8D1"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Text style={styles.eyeIcon}>{showConfirmPassword ? '👀' : '😌'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#A855F7', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>🎉 {t.register.registerButton}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>{t.register.hasAccount} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>{t.register.loginLink}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  emoji: {
    fontSize: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#A855F7',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 15,
    marginBottom: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  eyeButton: {
    padding: 12,
  },
  eyeIcon: {
    fontSize: 24,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  helpContainer: {
    marginBottom: 16,
  },
  helpText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#6B7280',
    fontSize: 13,
  },
  loginLink: {
    color: '#A855F7',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default RegisterForm;
