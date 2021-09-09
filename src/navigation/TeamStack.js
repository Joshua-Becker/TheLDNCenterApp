import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TeamScreen from '../screens/TeamScreen';
import AddTeamScreen from '../screens/AddTeamScreen';
import TeamMessagesScreen from '../screens/TeamMessagesScreen';
import FormScreen from '../screens/FormScreen';
import ChangeTeamScreen from '../screens/ChangeTeamScreen';
import { IconButton } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import HomeStack from './HomeStack';
import {useTheme} from './ThemeProvider';


const TeamStack = createStackNavigator();

export default function Team() {
    return (
      <TeamStack.Navigator mode='modal' headerMode='none'>
        <TeamStack.Screen name='TeamHome' component={TeamHome} />
        <TeamStack.Screen name='AddTeam' component={AddTeamScreen} />
        <TeamStack.Screen name='Form' component={FormScreen} />
        <TeamStack.Screen name='ChangeTeam' component={ChangeTeamScreen} />
        <TeamStack.Screen name='Home' component={HomeStack} />
        <TeamStack.Screen name='Messages' component={TeamMessagesScreen} />
      </TeamStack.Navigator>
    );
}

function TeamHome() {
  let {colors, isDark} = useTheme();
  const [hasTeam, setHasTeam] = useState(true)
  const user = auth().currentUser

  async function userHasTeam(){
    const userInfoRaw = await firestore()
    .collection('USERS')
    .doc(user.uid)
    .get()
    const userInfoData = userInfoRaw.data()
    if((userInfoData.pharmacyName != '' && userInfoData.pharmacyName != undefined) || (userInfoData.providerName != '' && userInfoData.providerName != undefined)){
      setHasTeam(true)
    } else {
      setHasTeam(false)
    }
  }

  useEffect(
    React.useCallback(() => {
      userHasTeam()
    }, [])
  );  

  return (
    <TeamStack.Navigator
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
      <TeamStack.Screen
      name='My Healthcare Team'
      component={TeamScreen}
      options={({ navigation }) => ({
        headerRight: () => (
          <IconButton
              icon ={ hasTeam ? 'account-switch' : 'message-plus'}
              size={28}
              color='#ffffff'
              onPress={() => {
                if(hasTeam) {
                  navigation.navigate('ChangeTeam')
                } else {
                  navigation.navigate('AddTeam')
                }
              }}
          />
        ),
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
      <TeamStack.Screen
      name='AddTeam'
      component={AddTeamScreen}
      options={({ navigation }) => ({
          title: 'Choose your team',
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
      <TeamStack.Screen
      name='ChangeTeam'
      component={ChangeTeamScreen}
      options={({ navigation }) => ({
          title: 'Change team',
          headerLeft: () => (
            <IconButton
                icon='home'
                size={28}
                color='#ffffff'
                onPress={() => navigation.navigate('Home')}
            />
          ),
          headerRight: () => (
            <IconButton
                icon='alpha-x-circle'
                size={28}
                color='#ffffff'
                onPress={() => navigation.goBack()}
            />
          ),
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
      <TeamStack.Screen
      name='Messages'
      component={TeamMessagesScreen}
      options={({ navigation }) => ({
          title: 'Messages',
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
      <TeamStack.Screen
      name='Form'
      component={FormScreen}
      options={({ navigation }) => ({
          title: 'Biweekly Form',
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
    </TeamStack.Navigator>
  );
}