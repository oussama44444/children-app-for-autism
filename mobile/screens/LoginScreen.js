import React, { useEffect, useState, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthScreenContainer from '../components/AuthScreenContainer';
import LoginForm from '../components/LoginForm';
import SuccessNotification from '../components/SuccessNotification';
import ErrorNotification from '../components/ErrorNotification';

const LoginScreen = ({ navigation }) => {
  const { login, loading, error, clearError, completeLogin } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const pendingUserRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Welcome');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleLogin = async (credentials) => {
    const result = await login(credentials, true); // true = delay navigation
    
    if (result.success) {
      pendingUserRef.current = result.user;
      setShowSuccess(true);
    } else {
      setErrorMessage(result.error);
      setShowError(true);
    }
  };

  const handleNotificationHide = () => {
    setShowSuccess(false);
    // Now complete the login by setting the user (triggers navigation)
    if (pendingUserRef.current) {
      completeLogin(pendingUserRef.current);
    }
  };

  const handleValidationError = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  return (
    <AuthScreenContainer>
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={errorMessage || error}
        clearError={clearError}
        navigation={navigation}
        onValidationError={handleValidationError}
      />
      <SuccessNotification 
        visible={showSuccess}
        message="Super ! Bienvenue dans l'aventure ! 🎊"
        onHide={handleNotificationHide}
      />
      <ErrorNotification 
        visible={showError}
        message={errorMessage}
        onHide={() => setShowError(false)}
      />
    </AuthScreenContainer>
  );
};

export default LoginScreen;
