import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import useStatusBar from '../utils/useStatusBar';

const { width, height } = Dimensions.get('screen');

export default function HomeScreen({ navigation }) {
    useStatusBar('light-content');
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
      <View style={styles.container}>
        <Image 
            source={require('../media/images/logo-light.png')} 
            style={styles.logo}
        />
        <View style={styles.stacks}>
          <View style={styles.buttonContainer}>
            <FormButton
              title='My Pharmacy'
              modeValue='contained'
              onPress={() => navigation.navigate('Pharmacy')}
            />
            {Boolean(showMessageNotification) && (
            <IconButton style={styles.notificationIcon} icon='alert-circle' color='white' size={40}/>
            )}
          </View>
          <FormButton
            title='About Me'
            modeValue='contained'
            onPress={() => navigation.navigate('Pharmacy')}
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#3F4253',
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