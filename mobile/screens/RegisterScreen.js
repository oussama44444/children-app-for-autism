import React, { useEffect, useState, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../locales';
import AuthScreenContainer from '../components/AuthScreenContainer';
import RegisterForm from '../components/RegisterForm';
import SuccessNotification from '../components/SuccessNotification';
import ErrorNotification from '../components/ErrorNotification';

const RegisterScreen = ({ navigation }) => {
  const { register, loading, error, clearError, completeLogin } = useAuth();
  const { language } = useLanguage();
  const t = getTranslation(language);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Login');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleRegister = async (userData) => {
    const result = await register(userData, true); // true = delay navigation

    if (result.success) {
      // Do not auto-login after registration. Redirect user to Login to sign in.
      setShowSuccess(true);
    } else {
      setErrorMessage(result.error);
      setShowError(true);
    }
  };

  const handleValidationError = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  const handleSuccessHide = () => {
    setShowSuccess(false);
    // After registering, always navigate to Login so the user can sign in
    navigation.navigate('Login');
  };

  return (
    <AuthScreenContainer>
      <RegisterForm
        onSubmit={handleRegister}
        loading={loading}
        error={errorMessage || error}
        clearError={clearError}
        navigation={navigation}
        onValidationError={handleValidationError}
      />
      <SuccessNotification 
        visible={showSuccess}
        message={language === 'fr' ? 'Super ! Ton compte est créé ! 🎉' : 'برافو! تم إنشاء حسابك! 🎉'}
        onHide={handleSuccessHide}
      />
      <ErrorNotification 
        visible={showError}
        message={errorMessage}
        onHide={() => setShowError(false)}
      />
    </AuthScreenContainer>
  );
};

export default RegisterScreen;
