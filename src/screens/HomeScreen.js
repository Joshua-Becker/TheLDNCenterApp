import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import useStatusBar from '../utils/useStatusBar';

const { width, height } = Dimensions.get('screen');

export default function HomeScreen({ navigation }) {
    useStatusBar('dark-content');
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    return (
      <View style={styles.container}>
        <Image 
            source={require('../media/images/logo-light.png')} 
            style={styles.logo}
        />
        <View style={styles.stacks}>
          <FormButton
            title='My Pharmacy'
            modeValue='contained'
            onPress={() => navigation.navigate('Pharmacy')}
          />
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
        height: height / 4.5,
    },
    stacks: {

    }
});