import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import useStatusBar from '../utils/useStatusBar';

export default function HomeScreen({ navigation }) {
    useStatusBar('dark-content');
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    return (
      <View style={styles.container}>
        {/* <Title style={styles.titleText}>The LDN Center app</Title> */}
        <FormButton
          title='My Pharmacy'
          modeValue='contained'
          labelStyle={styles.loginButtonLabel}
          onPress={() => navigation.navigate('Pharmacy')}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f5f5',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    titleText: {
      fontSize: 24,
      marginBottom: 10
    },
    loginButtonLabel: {
      fontSize: 15
    },
});