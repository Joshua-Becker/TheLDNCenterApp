import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResourcesScreen from '../screens/ResourcesScreen';
import SearchedResourcesScreen from '../screens/SearchedResourcesScreen';
import GetCYJScreen from '../screens/GetCYJScreen';
import AboutScreen from '../screens/AboutScreen';
import MyResourcesScreen from '../screens/MyResourcesScreen';
import { IconButton } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import HomeStack from './HomeStack';
import {useTheme} from './ThemeProvider';

const ResourcesStack = createStackNavigator();
export default function Resources() {
    return (
      <ResourcesStack.Navigator mode='modal' headerMode='none'>
        <ResourcesStack.Screen name='ResourcesHome' component={ResourcesHome} />
        <ResourcesStack.Screen name='About' component={AboutScreen} />
        <ResourcesStack.Screen name='MyResources' component={MyResourcesScreen} />
        <ResourcesStack.Screen name='GetCYJ' component={GetCYJScreen} />
        <ResourcesStack.Screen name='Home' component={HomeStack} />
      </ResourcesStack.Navigator>
    );
}

function ResourcesHome() {
  let {colors, isDark} = useTheme();
  const user = auth().currentUser 

  return (
    <ResourcesStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.navBar
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 20
        }
      }}
    >
    <ResourcesStack.Screen
      name='About'
      component={AboutScreen}
      options={({ navigation }) => ({
          title: 'About',
          headerLeft: () => (
            <IconButton
                icon='home'
                size={28}
                color='#ffffff'
                onPress={() => navigation.navigate('Home')}
            />
          )
      })}
      />
      <ResourcesStack.Screen
      name='Resources'
      component={ResourcesScreen}
      options={({ navigation }) => ({
        headerLeft: () => (
          <IconButton
              icon='home'
              size={28}
              color='#ffffff'
              onPress={() => navigation.navigate('Home')}
          />
        )
      })}
      />
      <ResourcesStack.Screen
      name='SearchedResources'
      component={SearchedResourcesScreen}
      options={({ navigation }) => ({
        headerLeft: () => (
          <IconButton
              icon='arrow-left'
              size={28}
              color='#ffffff'
              onPress={() => navigation.goBack()}
          />
        )
      })}
      />
      <ResourcesStack.Screen
      name='MyResources'
      component={MyResourcesScreen}
      options={({ navigation }) => ({
          title: 'My Resources',
          headerLeft: () => (
            <IconButton
                icon='home'
                size={28}
                color='#ffffff'
                onPress={() => navigation.navigate('Home')}
            />
          )
      })}
      />
      <ResourcesStack.Screen
      name='GetCYJ'
      component={GetCYJScreen}
      options={({ navigation }) => ({
          title: 'Get Website Data',
          headerLeft: () => (
            <IconButton
            icon='arrow-left'
                size={28}
                color='#ffffff'
                onPress={() => navigation.goBack()}
            />
          )
      })}
      />
    </ResourcesStack.Navigator>
  );
}