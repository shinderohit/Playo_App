
  import React, { useEffect } from 'react';
  import { ClerkProvider, useUser } from '@clerk/clerk-expo';
  import { NavigationContainer } from '@react-navigation/native';
  import { StatusBar } from 'expo-status-bar';
  import { StyleSheet, View } from 'react-native';
  import * as SecureStore from 'expo-secure-store';
  import RootNavigator from './navigation/RootNavigator';
  import { UserOnboardingProvider } from './contexts/UserOnboardingContext';
  import { useUserStore } from './stores/userStore';
  import './global.css';

  const tokenCache = {
    async getToken(key: string) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return await SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };

  const AppContent: React.FC = () => {
    const { user } = useUser();
    const { fetchUser, clearUser } = useUserStore();

    useEffect(() => {
      if (user?.id) {
        fetchUser(user.id);
      } else {
        clearUser();
      }
    }, [user, fetchUser, clearUser]);

    return (
      <UserOnboardingProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </UserOnboardingProvider>
    );
  };

  const App: React.FC = () => {
    return (
      <ClerkProvider
        publishableKey="pk_test_bGVuaWVudC16ZWJyYS0yMC5jbGVyay5hY2NvdW50cy5kZXYk"
        tokenCache={tokenCache}
      >
        <AppContent />
      </ClerkProvider>
    );
  };

  export default App;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  