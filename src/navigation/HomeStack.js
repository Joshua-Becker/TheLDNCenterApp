import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PharmacyStack from './PharmacyStack';
import SettingsScreen from '../screens/SettingsScreen';
import { IconButton } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';

const Stack = createStackNavigator();

export default function HomeStack() {
    return (
      <Stack.Navigator initialRouteName='Login' headerMode='none'>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Settings' component={SettingsScreen} />
        <Stack.Screen name='Pharmacy' component={PharmacyStack} />
      </Stack.Navigator>
    );
}

function Home() {
  const { user } = useContext(AuthContext);
  let firstname = '';
  if(user.displayName != null){
    firstname = ', ' + user.displayName.split(' ')[0];
  } else {
      console.log('HomeStack displayName not found');
  }

  const { logout } = useContext(AuthContext)
  return (
      //<HomeScreen />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#171921'
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontSize: 22
          }
        }}
      >
        <Stack.Screen
        name={'Welcome' + firstname} 
        component={HomeScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <IconButton
                icon='logout'
                size={28}
                color='#fff'
                onPress={() => logout()}
            />
          ),
          headerRight: () => (
            <IconButton
                icon='cog'
                size={28}
                color='#fff'
                onPress={() => navigation.navigate('Settings')}
            />
          )
        })}
        />
        <Stack.Screen
        name='Settings'
        component={SettingsScreen}
        options={({ navigation }) => ({
            title: 'Settings',
            headerBackTitle: 'Back'
        })}
        />
      </Stack.Navigator>
  );

}