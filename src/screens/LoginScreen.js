import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Text, TouchableOpacity, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import useStatusBar from '../utils/useStatusBar';
import Spinner from 'react-native-loading-spinner-overlay';
import {useTheme} from '../navigation/ThemeProvider';

const { width, height } = Dimensions.get('screen');

export default function LoginScreen({ navigation }) {
    useStatusBar();
    const {colors, isDark} = useTheme();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    return (
      <View style={styles(colors).container}>
        <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={styles(colors).spinnerTextStyle}
        />
        <View style={styles(colors).header}>
          <TouchableOpacity style={styles(colors).signUpBox} onPress={() => navigation.navigate('Signup')}>
            <Text 
            style={styles(colors).signUpText} 
            >SIGN UP</Text>
            <IconButton
                  icon='arrow-right'
                  size={20}
                  color='#fff'
            />
          </TouchableOpacity>
          <Image 
              source={ isDark? require('../media/images/logo-light.png') : require('../media/images/logo-dark.png')} 
              style={styles(colors).logo}
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
        </View>
        <FormButton
          title='Login'
          modeValue='contained'
          labelStyle={styles(colors).loginButtonLabel}
          onPress={async () => {
              setIsLoading(true);
              setEmail('');
              setPassword('');
              await login(email, password);
            }
          }
        />
      </View>
    );
}

const styles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    color: colors.text,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
    color: colors.text,
  },
  loginButtonLabel: {
    fontSize: 22,
    color: colors.buttonText,
  },
  navButtonText: {
    fontSize: 16
  },
  spinnerTextStyle: {
    color: colors.text
  },
  logo: {
    width: width / 1.5,
    height: width / 3,
    marginTop: 20,
  },
  signUpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    width: width,
    justifyContent: 'flex-end',
    paddingBottom: 5,
    paddingRight: 10,
  },
  signUpText: {
    color: colors.buttonText,
    fontSize: 20,
  },
});