import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/userService';
import notificationService from '../services/notificationService';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user_token, setUserToken] = useState(null);
  const [owner_token, setOwnerToken] = useState(null);
  const [loading, setLoading] = useState(true);
  // track whether the splash has been seen at least once (persisted, never removed on logout)
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

  // 🔹 Load tokens and user from storage
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedUserToken = await AsyncStorage.getItem('padel_user_token');
        const storedOwnerToken = await AsyncStorage.getItem('padel_owner_token');

        if (storedUserToken) {
          const storedUser = await AsyncStorage.getItem('padel_user_user');
          setToken(storedUserToken);
          setUserToken(storedUserToken);
          setUser(JSON.parse(storedUser));
          setRole('user');
        }

        if (storedOwnerToken) {
          const storedOwner = await AsyncStorage.getItem('padel_owner_user');
          setOwnerToken(storedOwnerToken);
          if (!storedUserToken) {
            setToken(storedOwnerToken);
            setUser(JSON.parse(storedOwner));
            setRole('owner');
          }
        }
        // load persistent splash flag (if user has already seen it)
        const seen = await AsyncStorage.getItem('padel_seen_splash');
        setHasSeenSplash(seen === 'true');
      } catch (err) {
        console.error('Error loading auth data', err);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  // get All users
  const getAllUsers = async (page = 1, limit = 10, search = '') => {
    try {
      if (!token) return { users: [], pagination: {} };
      const data = await userService.getAllUsers(token, page, limit, search);
      setUsers(data.data || []);
      return {
        users: data.data || [],
        pagination: data.pagination || {}
      };
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
      return { users: [], pagination: {} };
    }
  }


  // 🔹 Login
  const login = async (email, password) => {
    try {
      const data = await userService.login(email, password);
      const userRole = data.user.role?.[0]?.role || data.user.role;

      setToken(data.jwt);
      setUser(data.user);
      setRole(userRole);

      if (userRole === 'owner') {
        setOwnerToken(data.jwt);
        await AsyncStorage.setItem('padel_owner_token', data.jwt);
        await AsyncStorage.setItem('padel_owner_user', JSON.stringify(data.user));
      } else {
        setUserToken(data.jwt);
        await AsyncStorage.setItem('padel_user_token', data.jwt);
        await AsyncStorage.setItem('padel_user_user', JSON.stringify(data.user));
      }

      return { success: true, role: userRole, user: data.user };
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.error || err.message || 'There is an error logging in';
      return { success: false, error: errorMessage };
    }
  };

  // 🔹 Signup
  const signup = async (userData) => {
    try {
      const data = await userService.signup(userData);
      console.log('Signup successful:', data);
      return { success: true };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, error: 'There is an error creating your account' };
    }
  };

  // 🔹 Forget password (send reset email)
  const forgetPassword = async (email) => {
    try {
      const data = await userService.forgetPassword(email);
      // Backend returns { message, resetPasswordToken }
      return { success: true, data };
    } catch (err) {
      console.error('Forget password error:', err);
      const errorMessage = err.error || err.message || 'There is an error sending reset email';
      return { success: false, error: errorMessage };
    }
  };

  // 🔹 Logout
  const logout = useCallback(async () => {
    try {
      console.log('Performing logout...');
      
      // Remove push notification token from backend
      try {
        await notificationService.removeTokenFromBackend();
        console.log("✅ Push notification token removed");
      } catch (notifError) {
        console.warn("⚠️ Failed to remove notification token:", notifError);
        // Don't block logout if notification removal fails
      }
      
      await AsyncStorage.multiRemove([
        'padel_user_token',
        'padel_user_user',
        'padel_owner_token',
        'padel_owner_user',
      ]);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      setRole(null);
      setUserToken(null);
      setOwnerToken(null);
    }
  }, []);

  // Mark the splash as seen (persisted). Call when the user finishes the splash flow.
  const markSplashSeen = async () => {
    try {
      await AsyncStorage.setItem('padel_seen_splash', 'true');
      setHasSeenSplash(true);
    } catch (err) {
      console.error('Error persisting splash flag', err);
    }
  };

  // 🔹 Update Profile (used by HandPopup and any edit profile screen)
    const updateProfile = async (updatedFields) => {
      try {
        if (!user) return;

        let dataToSend = updatedFields;
        if (!(updatedFields instanceof FormData) && updatedFields.image) {
          const formData = new FormData();
          for (const key in updatedFields) {
            if (updatedFields[key] !== undefined && updatedFields[key] !== null) {
              if (key === 'image' && !updatedFields.image.startsWith('http')) {
                formData.append('image', {
                  uri: updatedFields.image,
                  name: `profile_${Date.now()}.jpg`,
                  type: 'image/jpeg',
                });
              } else {
                formData.append(key, updatedFields[key]);
              }
            }
          }
          dataToSend = formData;
        }

        // Send to backend
        const response = await userService.updateProfile(token, dataToSend, {
          headers: {
            'Content-Type': dataToSend instanceof FormData ? 'multipart/form-data' : 'application/json',
          },
        });

        // Use server response.user instead of optimistic merge
        const updatedUserFromServer = response.user;

        setUser(updatedUserFromServer);

        if (role === 'user') {
          await AsyncStorage.setItem('padel_user_user', JSON.stringify(updatedUserFromServer));
        } else {
          await AsyncStorage.setItem('padel_owner_user', JSON.stringify(updatedUserFromServer));
        }

        return { success: true, user: updatedUserFromServer };
      } catch (err) {
        console.error('Error updating profile:', err);
        return { success: false, error: 'There is an error updating your profile' };
      }
    };



  return (
    <UserContext.Provider
      value={{
        user,
        token,
        role,
        user_token,
        owner_token,
        hasSeenSplash,
        login,
        signup,
        forgetPassword,
        markSplashSeen,
        logout,
        loading,
        updateProfile, 
        getAllUsers,
        users
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

export default UserContext;
