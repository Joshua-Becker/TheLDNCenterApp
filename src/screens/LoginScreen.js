import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { IconButton } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import useStatusBar from '../utils/useStatusBar';
import Spinner from 'react-native-loading-spinner-overlay';
import { ImageBackground } from 'react-native';
import PushNotification from "react-native-push-notification";

const { width, height } = Dimensions.get('screen');

export default function LoginScreen({ navigation }) {
    useStatusBar();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function createNotificationChannel(){
      PushNotification.createChannel({
        channelId: 'login-channel',
        channelName: 'Login Channel',
      });
    }

    useEffect(() => {
      createNotificationChannel();
      setIsLoading(false);
      return () => setIsLoading(false);
    }, []);
    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      style={styles.container}>
        <ImageBackground source={require('../media/images/mainpage_photo.jpeg')}  style={styles.container} imageStyle={styles.backgroundImage}>
          <Spinner
            visible={isLoading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <View style={styles.header}>
            <TouchableOpacity style={Platform.OS === 'ios' ? styles.signUpBoxIOS : styles.signUpBox} onPress={() => navigation.navigate('Signup')}>
              <Text 
              style={styles.signUpText} 
              >Sign up</Text>
              <IconButton
                    icon='arrow-right'
                    size={20}
                    color='#fff'
              />
            </TouchableOpacity>
            <Image 
                source={require('../media/images/logo-dark.png')} 
                style={styles.logo}
            />
          </View>
          <View>
            <FormInput
              labelName='Email'
              value={email}
              autoCapitalize='none'
              onChangeText={userEmail => setEmail(userEmail)}
            />
            <FormInput
              labelName='Password'
              value={password}
              secureTextEntry={true}
              onChangeText={userPassword => setPassword(userPassword)}
            />
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={() => {navigation.navigate('ForgotPassword')}}
              >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <FormButton
            title='Login'
            modeValue='contained'
            labelStyle={styles.loginButtonLabel}
            onPress={async () => {
                setIsLoading(true);
                setEmail('');
                setPassword('');
                let loggedIn = await login(email, password);
                if(!loggedIn){
                  setIsLoading(false);
                }
                //setIsLoading(false); // Will throw warning if there is a successful login
              }
            }
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#000000',
    paddingBottom: 20,
  },
  backgroundImage: {
    resizeMode: "cover",
    height: '100%', // the image height
    left: -400,
    top: undefined,
    opacity: 0.4,
  },
  header: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
    color: '#000000',
  },
  loginButtonLabel: {
    fontSize: 22,
    color: '#fff',
  },
  navButtonText: {
    fontSize: 16
  },
  spinnerTextStyle: {
    color: '#fff'
  },
  logo: {
    width: width / 1.5,
    height: width / 3,
    marginTop: 20,
  },
  signUpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E97E33',
    width: width,
    justifyContent: 'flex-end',
    paddingBottom: 5,
    paddingRight: 10,
  },
  signUpBoxIOS: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#002e45',
    width: width,
    justifyContent: 'flex-end',
    paddingBottom: 5,
    paddingRight: 10,
    paddingTop: 30,
  },
  signUpText: {
    color: '#fff',
    fontSize: 20,
  },
  forgotPasswordContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#E97E33',
    fontSize: 24,
    fontWeight: 'bold',
  }
});