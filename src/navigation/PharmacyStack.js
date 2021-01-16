import React, { useState, useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PharmacyScreen from '../screens/PharmacyScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import RoomScreen from '../screens/RoomScreen';
import FormScreen from '../screens/FormScreen';
import ChangePharmacyScreen from '../screens/ChangePharmacyScreen';
import { IconButton } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import HomeStack from '../navigation/HomeStack';

const PharmacyStack = createStackNavigator();
const ModalStack = createStackNavigator();

export default function Pharmacy() {
    return (
      <ModalStack.Navigator mode='modal' headerMode='none'>
        <ModalStack.Screen name='PharmacyHome' component={PharmacyHome} />
        <ModalStack.Screen name='AddRoom' component={AddRoomScreen} />
        <ModalStack.Screen name='Form' component={FormScreen} />
        <ModalStack.Screen name='ChangePharmacy' component={ChangePharmacyScreen} />
        <ModalStack.Screen name='Home' component={HomeStack} />
      </ModalStack.Navigator>
    );
}

function PharmacyHome() {
  const { logout } = useContext(AuthContext)
  const [hasPharmacy, setHasPharmacy] = useState(true)
  const user = auth().currentUser

  async function userHasPharmacy(){
    const userInfoRaw = await firestore()
    .collection('USERS')
    .doc(user.uid)
    .get()
    const userInfoData = userInfoRaw.data()
    if(userInfoData.pharmacyName != ''){
      setHasPharmacy(true)
    } else {
      setHasPharmacy(false)
    }
  }

  useEffect(() => {
    userHasPharmacy()
  })

  return (
    <PharmacyStack.Navigator
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
      <PharmacyStack.Screen
      name='MyPharmacy'
      component={PharmacyScreen}
      options={({ navigation }) => ({
        headerRight: () => (
          <IconButton
              icon='message-plus'
              size={28}
              color='#ffffff'
              onPress={() => {
                if(hasPharmacy) {
                  navigation.navigate('ChangePharmacy')
                } else {
                  navigation.navigate('AddRoom')
                }
              }}
          />
        ),
        headerLeft: () => (
          <IconButton
              icon='logout'
              size={28}
              color='#ffffff'
              onPress={() => navigation.navigate('Home')}
          />
        )
      })}
      />
      <PharmacyStack.Screen
      name='Room'
      component={RoomScreen}
      options={({ route }) => ({
          title: route.params.thread.name
      })}
      />
    </PharmacyStack.Navigator>
  );
}