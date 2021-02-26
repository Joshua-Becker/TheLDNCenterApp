import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import FormButton from '../components/FormButton';
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
        <View style={styles(colors).stacks}>
          <View style={styles(colors).buttonContainer}>
            <FormButton
              title='My Pharmacy'
              modeValue='contained'
              onPress={() => navigation.push('Pharmacy')}
            />
            {Boolean(showMessageNotification) && (
            <IconButton style={styles(colors).notificationIcon} icon='alert-circle' color='white' size={40}/>
            )}
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
  notificationIcon: {
    position: 'absolute',
    right: -width / 15,
    top: -width / 30,
    backgroundColor: '#3F4252',
    margin: 0,
    width: 50,
    height: 50,
  }
});