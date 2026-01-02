import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useLanguage } from "./contexts/LanguageContext";
import { getTranslation } from "./locales";
import { StoriesProvider } from "./contexts/StoriesContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import WelcomeScreen from "./screens/WelcomeScreen";
import LanguageSelectionScreen from "./screens/LanguageSelectionScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import StoriesListScreen from "./screens/StoriesListScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";
import PaymentScreen from "./screens/PaymentScreen";
import SubscriptionDetailsScreen from "./screens/SubscriptionDetailsScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import HelpScreen from "./screens/HelpScreen";
import SettingsScreen from "./screens/SettingsScreen";
import StoryPlayerScreen from "./screens/StoryPlayerScreen";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from "./contexts/userContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for authenticated users
const MainTabs = () => {
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const t = getTranslation(language);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 10,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
        },
        tabBarActiveTintColor: '#A855F7',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: t.tabs.home,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive,
              ]}
            >
              <Text style={styles.tabIcon}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="StoriesTab"
        component={StoriesListScreen}
        options={{
          tabBarLabel: t.tabs.stories,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive,
              ]}
            >
              <Text style={styles.tabIcon}>📚</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: t.tabs.profile,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive,
              ]}
            >
              <Text style={styles.tabIcon}>👤</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Navigation component that handles auth state
const Navigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 400,
        animationTypeForReplace: "pop",
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="LanguageSelection"
            component={LanguageSelectionScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              animation: "slide_from_bottom",
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="Subscription"
            component={SubscriptionScreen}
            options={{
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="SubscriptionDetails"
            component={SubscriptionDetailsScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="Help"
            component={HelpScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="StoryPlayer"
            component={StoryPlayerScreen}
            options={{
              animation: "slide_from_bottom",
              presentation: "fullScreenModal",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

// Main App component
export default function App() {
  useEffect(() => {
    // Lock screen orientation to landscape globally
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    // Hide navigation bar (Android) - immersive mode
    const hideNavigationBar = async () => {
      await NavigationBar.setVisibilityAsync('hidden');
      await NavigationBar.setBehaviorAsync('overlay-swipe');
    };

    lockOrientation();
    hideNavigationBar();

    // No cleanup - keep settings throughout the app
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <UserProvider>
        <StoriesProvider>
          <SubscriptionProvider>
            <NavigationContainer>
              <StatusBar hidden={true} />
              <Navigation />
            </NavigationContainer>
          </SubscriptionProvider>
        </StoriesProvider>
        </UserProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  tabIconContainerActive: {
    backgroundColor: "#E9D5FF",
  },
  tabIcon: {
    fontSize: 24,
  },
});