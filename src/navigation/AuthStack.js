import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import {useTheme} from '../navigation/ThemeProvider';

const Stack = createStackNavigator();
const SignupStack = createStackNavigator();


export default function AuthStack() {
    return (
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Signup' component={Signup} />
      </Stack.Navigator>
    );
}

function Signup() {
  const {colors, isDark} = useTheme();
  return (
    <SignupStack.Navigator
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
      <SignupStack.Screen
      name='Signup'
      component={SignupScreen}
      options={() => ({
          title: 'Sign Up'
      })}
      />
    </SignupStack.Navigator>
  );
}