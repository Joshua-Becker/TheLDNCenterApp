import React, { useState, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import RoomScreen from '../screens/RoomScreen';
import { IconButton } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';

const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

export default function HomeStack() {
    return (
      <ModalStack.Navigator mode='modal' headerMode='none'>
        <ModalStack.Screen name='ChatApp' component={ChatApp} />
        <ModalStack.Screen name='AddRoom' component={AddRoomScreen} />
      </ModalStack.Navigator>
    );
}

function ChatApp() {
    const { logout } = useContext(AuthContext);

    return (
      <ChatAppStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6646ee'
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontSize: 22
          }
        }}
      >
        <ChatAppStack.Screen
        name='Home'
        component={HomeScreen}
        options={({ navigation }) => ({
            headerRight: () => (
            <IconButton
                icon='message-plus'
                size={28}
                color='#ffffff'
                onPress={() => navigation.navigate('AddRoom')}
            />
            ),
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
        <ChatAppStack.Screen
        name='Room'
        component={RoomScreen}
        options={({ route }) => ({
            title: route.params.thread.name
        })}
        />
      </ChatAppStack.Navigator>
    );
}