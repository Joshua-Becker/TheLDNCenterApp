import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import { IconButton } from 'react-native-paper';

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
  return (
    <SignupStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#171921',
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