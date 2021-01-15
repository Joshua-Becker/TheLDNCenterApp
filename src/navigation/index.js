import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './AuthProvider';
import Routes from './Routes';

/**
 * Wrap all providers here
 */

export default function Providers(props) {
  return (
    <PaperProvider>
      <AuthProvider fcmToken={props.FCMToken}>
        <Routes/>
      </AuthProvider>
    </PaperProvider>
  );
}