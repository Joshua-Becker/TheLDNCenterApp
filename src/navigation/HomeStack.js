import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PharmacyStack from './PharmacyStack';
import { IconButton } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();

export default function HomeStack() {
    return (
      <Stack.Navigator initialRouteName='Login' headerMode='none'>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Pharmacy' component={PharmacyStack} />
      </Stack.Navigator>
    );
}

function Home() {
  let firstname = '';
  try {
    firstname = ', ' + (auth().currentUser.displayName).split(' ')[0];
  } catch (err){
    console.log('HomeStack displayName not found: ' + err);
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
          )
        })}
        />
      </Stack.Navigator>
  );

}