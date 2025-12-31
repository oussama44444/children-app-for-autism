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

const LoginForm = ({ onSubmit, loading, error, clearError, navigation, onValidationError }) => {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleLogin = () => {
    Keyboard.dismiss();

    if (!email || !password) {
      if (onValidationError) {
        onValidationError(language === 'fr' ? 'Veuillez remplir tous les champs' : 'املا جميع الحقول');
      }
      return;
    }
    onSubmit({ email, password });
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
          <Text style={styles.emoji}>😊</Text>
        </View>

        <Text style={styles.title}>{t.login.title}</Text>
        <Text style={styles.subtitle}>{t.login.subtitle}</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Your Name Label */}
        <Text style={styles.label}>{t.login.email}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.login.emailPlaceholder}
          placeholderTextColor="#B8B8D1"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            clearError();
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Secret Code Label */}
        <Text style={styles.label}>{t.login.password}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder={t.login.passwordPlaceholder}
            placeholderTextColor="#B8B8D1"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError();
            }}
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

        {/* Let's Go Button with Gradient */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
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
              <>
                <Text style={styles.loginButtonText}>⚡ {t.login.loginButton}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom Icons */}
        <View style={styles.bottomIcons}>
          <View style={[styles.iconButton, { backgroundColor: '#FFC1E3' }]}>
            <Text style={styles.iconEmoji}>❤️</Text>
          </View>
          <View style={[styles.iconButton, { backgroundColor: '#A7C7E7' }]}>
            <Text style={styles.iconEmoji}>⭐</Text>
          </View>
          <View style={[styles.iconButton, { backgroundColor: '#FFD700' }]}>
            <Text style={styles.iconEmoji}>✨</Text>
          </View>
          <View style={[styles.iconButton, { backgroundColor: '#B4E7CE' }]}>
            <Text style={styles.iconEmoji}>😊</Text>
          </View>
        </View>

        {/* Need Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>Besoin d'aide ? Demande à un parent ! 👨‍👩‍👧</Text>
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>{t.login.noAccount} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>{t.login.registerLink}</Text>
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
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A855F7',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    fontSize: 15,
    marginBottom: 18,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
  },
  eyeButton: {
    padding: 14,
  },
  eyeIcon: {
    fontSize: 26,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 20,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  iconEmoji: {
    fontSize: 24,
  },
  helpContainer: {
    marginBottom: 18,
  },
  helpText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  registerLink: {
    color: '#A855F7',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginForm;
