import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import TeamStack from './TeamStack';
import SettingsScreen from '../screens/SettingsScreen';
import { IconButton } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import SessionTimeout from '../utils/sessionTimeout'

const Stack = createStackNavigator();

export default function HomeStack() {
    return (
      <>
        <Stack.Navigator initialRouteName='Login' headerMode='none'>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Settings' component={SettingsScreen} />
          <Stack.Screen name='Team' component={TeamStack} />
        </Stack.Navigator>
        <SessionTimeout/>
      </>
    );
}

function Home() {
  let {colors, isDark} = useTheme();
  const { user, logout } = useContext(AuthContext);
  let firstname = '';
  if(user.displayName != null){
    firstname = ', ' + user.displayName.split(' ')[0];
  } else {
      //navigation.push('Home');
      //console.log('HomeStack displayName not found');
  }
  return (
      //<HomeScreen />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.navBar
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
                onPress={() => navigation.push('Settings')}
            />
          )
        })}
        />
        <Stack.Screen
        name='Settings'
        component={SettingsScreen}
        options={({ navigation }) => ({
            title: 'Settings',
            headerLeft: () => (
              <IconButton
                  icon='arrow-left'
                  size={28}
                  color='#fff'
                  onPress={() => navigation.push('Home')}
              />
            ),
        })}
        />
      </Stack.Navigator>
  );

}