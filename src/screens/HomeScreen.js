import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import FormButton from '../components/FormButton';
import Notification from '../components/Notification';
import { AuthContext } from '../navigation/AuthProvider';
import useStatusBar from '../utils/useStatusBar';
import {useTheme} from '../navigation/ThemeProvider';

const { width, height } = Dimensions.get('screen');

export default function HomeScreen({ navigation }) {
    useStatusBar();
    const {colors, isDark} = useTheme();

    const { notifications, checkForNotifications } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [showMessageNotification, setShowMessageNotification] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
      checkForNotifications(); 
      if(notifications == null){
        setShowMessageNotification(false);
      } else if (notifications.unreadMessageFromPharmacy == true){
        setShowMessageNotification(true);
      }
    }, []);

    return (
      <View style={styles(colors).container}>
        <Image 
            source={isDark? require('../media/images/logo-light.png') : require('../media/images/logo-dark.png')} 
            style={styles(colors).logo}
        />
        {Boolean(showMessageNotification) && (
        <View style={styles(colors).notifications}>
          <View style={styles(colors).notificationTitleContainer}>
            <Text style={styles(colors).notificationTitleText}>Notifications</Text>
          </View>
          <Notification
            navigation={navigation}
            text='My Pharmacy - Message'
            link='Pharmacy'
          />
        </View>
        )}
        <View style={styles(colors).stacks}>
          <View style={styles(colors).buttonContainer}>
            <FormButton
              title='My Pharmacy'
              modeValue='contained'
              onPress={() => navigation.push('Pharmacy')}
            />
          </View>
          {/* <FormButton
            title='About Me'
            modeValue='contained'
            onPress={() => navigation.push('Pharmacy')}
          /> */}
        </View>
      </View>
    );
}

const styles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: height / 9,
    paddingTop: height / 9,
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10
  },
  logo: {
      width: width / 1.5,
      height: width / 3,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  notificationTitleContainer: {
    width: width * 0.9,
    borderBottomWidth: 1,
    borderColor: colors.text,
    padding: 15,
    marginBottom: 10,
  },
  notificationTitleText: {
    color: colors.text,
    fontSize: 20,
  },
});