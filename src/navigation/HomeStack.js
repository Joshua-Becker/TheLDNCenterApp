import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PharmacyStack from './PharmacyStack';
import { IconButton } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';

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
    const { logout } = useContext(AuthContext)
    return (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0C5FAA'
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontSize: 22
            }
          }}
        >
          <Stack.Screen
          name='The LDN Center'
          component={HomeScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <IconButton
                  icon='logout'
                  size={28}
                  color='#ffffff'
                  onPress={() => logout()}
              />
            )
          })}
          />
        </Stack.Navigator>
    );

}