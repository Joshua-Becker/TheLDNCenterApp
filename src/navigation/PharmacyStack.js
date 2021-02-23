import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PharmacyScreen from '../screens/PharmacyScreen';
import AddPharmacyScreen from '../screens/AddPharmacyScreen';
import PharmacyMessagesScreen from '../screens/PharmacyMessagesScreen';
import FormScreen from '../screens/FormScreen';
import ChangePharmacyScreen from '../screens/ChangePharmacyScreen';
import { IconButton } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import HomeStack from '../navigation/HomeStack';

const PharmacyStack = createStackNavigator();

export default function Pharmacy() {
    return (
      <PharmacyStack.Navigator mode='modal' headerMode='none'>
        <PharmacyStack.Screen name='PharmacyHome' component={PharmacyHome} />
        <PharmacyStack.Screen name='AddPharmacy' component={AddPharmacyScreen} />
        <PharmacyStack.Screen name='Form' component={FormScreen} />
        <PharmacyStack.Screen name='ChangePharmacy' component={ChangePharmacyScreen} />
        <PharmacyStack.Screen name='Home' component={HomeStack} />
      </PharmacyStack.Navigator>
    );
}

function PharmacyHome() {
  const [hasPharmacy, setHasPharmacy] = useState(true)
  const user = auth().currentUser

  async function userHasPharmacy(){
    const userInfoRaw = await firestore()
    .collection('USERS')
    .doc(user.uid)
    .get()
    const userInfoData = userInfoRaw.data()
    if(userInfoData.pharmacyName != '' && userInfoData.pharmacyName != undefined){
      setHasPharmacy(true)
    } else {
      setHasPharmacy(false)
    }
  }

  useEffect(
    React.useCallback(() => {
      userHasPharmacy()
    }, [])
  );  

  return (
    <PharmacyStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#171921'
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 20
        }
      }}
    >
      <PharmacyStack.Screen
      name='My Pharmacy'
      component={PharmacyScreen}
      options={({ navigation }) => ({
        headerRight: () => (
          <IconButton
              icon ={ hasPharmacy ? 'account-switch' : 'message-plus'}
              size={28}
              color='#ffffff'
              onPress={() => {
                if(hasPharmacy) {
                  navigation.navigate('ChangePharmacy')
                } else {
                  navigation.navigate('AddPharmacy')
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
      <PharmacyStack.Screen
      name='AddPharmacy'
      component={AddPharmacyScreen}
      options={({ navigation }) => ({
          title: 'Choose your pharmacy',
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
      <PharmacyStack.Screen
      name='ChangePharmacy'
      component={ChangePharmacyScreen}
      options={({ navigation }) => ({
          title: 'Change Pharmacy',
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
          )
      })}
      />
      <PharmacyStack.Screen
      name='Messages'
      component={PharmacyMessagesScreen}
      options={() => ({
          title: 'Messages'
      })}
      />
      <PharmacyStack.Screen
      name='Form'
      component={FormScreen}
      options={() => ({
          title: 'Biweekly Form'
      })}
      />
    </PharmacyStack.Navigator>
  );
}