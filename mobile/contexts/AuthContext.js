import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as userService from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
    }
  };

  const login = async (credentials, delayNavigation = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.login(credentials);
      const jwt = res.jwt || res.token || res.data?.token;
      const resUser = res.user || res.data || null;

      if (!jwt || !resUser) {
        const message = res.message || 'Invalid response from server';
        throw new Error(message);
      }

      await AsyncStorage.setItem('authToken', jwt);
      await AsyncStorage.setItem('user', JSON.stringify(resUser));

      if (delayNavigation) {
        setToken(jwt);
        return { success: true, user: resUser, token: jwt };
      }

      setToken(jwt);
      setUser(resUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      const status = err?.response?.status;
      const respData = err?.response?.data;
      console.error('[AuthContext.login] login failed', { credentials: { email: credentials.email }, status, respData, message: err.message });
      const errorMessage = respData?.error || respData?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const register = async (userData, delayNavigation = false) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[AuthContext.register] Starting registration...', { email: userData.email });
      const res = await userService.register(userData);
      console.log('[AuthContext.register] Registration response:', res);

      // If backend does not return token/user on register, try to login immediately
      if (res && (res.jwt || res.user)) {
        const jwt = res.jwt || res.token;
        const resUser = res.user || null;
        if (jwt && resUser) {
          await AsyncStorage.setItem('authToken', jwt);
          await AsyncStorage.setItem('user', JSON.stringify(resUser));
          if (!delayNavigation) {
            setToken(jwt);
            setUser(resUser);
            setIsAuthenticated(true);
          } else {
            setToken(jwt);
            return { success: true, user: resUser, token: jwt };
          }
          return { success: true };
        }
      }

      // Attempt to auto-login after registration using provided credentials
      if (userData.email && userData.password) {
        console.log('[AuthContext.register] Attempting auto-login...');
        const loginResult = await login({ email: userData.email, password: userData.password }, delayNavigation);
        console.log('[AuthContext.register] Auto-login result:', loginResult);
        if (loginResult.success) return loginResult; // propagate user/token when delayNavigation is used
        // If auto-login failed, still consider registration successful
        console.log('[AuthContext.register] Auto-login failed but registration succeeded');
        return { success: true, message: res.message || 'Registration successful. Please login.' };
      }

      // If registration succeeded but auto-login wasn't possible
      return { success: true, message: res.message || 'Registration successful' };
    } catch (err) {
      const status = err?.response?.status;
      const respData = err?.response?.data;
      console.error('[AuthContext.register] register failed', { payload: { email: userData.email }, status, respData, message: err.message });
      const errorMessage = respData?.error || respData?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const updatedUser = { ...user, ...updatedUserData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      console.error('Update user error:', err);
      return { success: false, error: err.message };
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        clearError,
        completeLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
