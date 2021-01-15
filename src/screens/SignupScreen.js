import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, IconButton } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [condition, setCondition] = useState('');
  const { register } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>Register to chat</Title>
      <FormInput
        labelName='First name'
        value={firstName}
        autoCapitalize='none'
        onChangeText={userFirstName => setFirstName(userFirstName)}
      />
      <FormInput
        labelName='Last name'
        value={lastName}
        autoCapitalize='none'
        onChangeText={userLastName => setLastName(userLastName)}
      />
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
      <FormInput
        labelName='Reason for taking LDN'
        value={condition}
        autoCapitalize='none'
        onChangeText={userCondition => setCondition(userCondition)}
      />
      <FormButton
        title='Signup'
        modeValue='contained'
        labelStyle={styles.loginButtonLabel}
        onPress={() => register(firstName, lastName, email, password, condition)}
      />
      <IconButton
        icon='keyboard-backspace'
        size={30}
        style={styles.navButton}
        color='#0C5FAA'
        onPress={() => navigation.goBack()}
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
    fontSize: 22
  },
  navButtonText: {
    fontSize: 18
  },
  navButton: {
    marginTop: 10
  }
});