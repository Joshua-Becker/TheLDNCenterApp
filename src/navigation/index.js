import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './AuthProvider';
import Routes from './Routes';

/**
 * Wrap all providers here
 */

const theme = {
  ...DefaultTheme,
  dark: true,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

export default function Providers(props) {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider fcmToken={props.FCMToken}>
        <Routes/>
      </AuthProvider>
    </PaperProvider>
  );
}