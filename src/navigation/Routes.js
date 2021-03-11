import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import { AuthContext } from './AuthProvider';
import Loading from '../components/Loading';
import {AppearanceProvider} from 'react-native-appearance';
import {ThemeProvider} from './ThemeProvider';

export default function Routes() {
  const { user, setUser } = useContext(AuthContext);
  const { ethree } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  return (
    <AppearanceProvider>
      <ThemeProvider>
        <NavigationContainer>
          {(user && ethree) ? <HomeStack /> : <AuthStack />}
        </NavigationContainer>
      </ThemeProvider>
    </AppearanceProvider>
  );
}