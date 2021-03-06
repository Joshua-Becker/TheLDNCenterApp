import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import {useTheme} from '../navigation/ThemeProvider';

const Stack = createStackNavigator();
//const SignupStack = createStackNavigator();


export default function AuthStack() {
    return (
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
      </Stack.Navigator>
    );
}

function ForgotPassword() {
  const {colors, isDark} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.navBar,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 22
        }
      }}
    >
      <Stack.Screen
      name='ForgotPassword'
      component={ForgotPasswordScreen}
      options={() => ({
          title: 'Password Reset'
      })}
      />
    </Stack.Navigator>
  );
}

function Signup() {
  const {colors, isDark} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.navBar,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 22
        }
      }}
    >
      <Stack.Screen
      name='Signup'
      component={SignupScreen}
      options={() => ({
          title: 'Sign Up'
      })}
      />
    </Stack.Navigator>
  );
}