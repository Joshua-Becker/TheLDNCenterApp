import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Dimensions, Text, TouchableOpacity, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import useStatusBar from '../utils/useStatusBar';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get('screen');

export default function LoginScreen({ navigation }) {
    useStatusBar('light-content');
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    return (
      <View style={styles.container}>
        <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.header}>
          <TouchableOpacity style={styles.signUpBox} onPress={() => navigation.navigate('Signup')}>
            <Text 
            style={styles.signUpText} 
            >SIGN UP</Text>
            <IconButton
                  icon='arrow-right'
                  size={20}
                  color='#fff'
            />
          </TouchableOpacity>
          <Image 
              source={require('../media/images/logo-light.png')} 
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
        </View>
        <FormButton
          title='Login'
          modeValue='contained'
          labelStyle={styles.loginButtonLabel}
          onPress={async () => {
              setIsLoading(true);
              setEmail('');
              setPassword('');
              await login(email, password);
              setIsLoading(false);        
            }
          }
        />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3F4253',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
    color: '#fff',
  },
  loginButtonLabel: {
    fontSize: 22,
    color: '#fff',
  },
  navButtonText: {
    fontSize: 16
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  logo: {
    width: width / 1.5,
    height: width / 3,
    marginTop: 20,
  },
  signUpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171921',
    width: width,
    justifyContent: 'flex-end',
    paddingTop: 40,
    paddingBottom: 5,
    paddingRight: 10,
  },
  signUpText: {
    color: '#fff',
    fontSize: 20,
  },
});