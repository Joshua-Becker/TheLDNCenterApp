import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import {Picker} from '@react-native-picker/picker';
import FormComments from '../components/FormComments';
import { Divider } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import useStatusBar from '../utils/useStatusBar';
import { IconButton } from 'react-native-paper';
import {useTheme} from '../navigation/ThemeProvider';

export default function SignupScreen({ navigation }) {
  const {colors, isDark} = useTheme();
  useStatusBar();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [condition, setCondition] = useState('');
  const { register } = useContext(AuthContext);
  const [painLevel, setPainLevel] = useState(0);
  const [symptomTimeline, setSymptomTimeline] = useState('');
  const [medications, setMedications] = useState('');
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoding] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={styles(colors).spinnerTextStyle}
      />
      <View style={styles(colors).form}>
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
        <Divider style={styles(colors).divider} />
        <Text style={styles(colors).formHeader}>Current level of pain or discomfort</Text>
        <View style={styles(colors).pickerContainer}> 
          <Picker style={styles(colors).picker} itemStyle={styles(colors).pickerItems} selectedValue={painLevel} onValueChange={(itemValue, itemIndex) => setPainLevel(itemValue)}>
            <Picker.Item label="0" value="0" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="8" value="8" />
            <Picker.Item label="9" value="9" />
            <Picker.Item label="10" value="10" />
          </Picker>
          <IconButton
            icon='arrow-down-drop-circle'
            size={15}
            color='#fff'
            style={styles(colors).pickerIcon}
          />
        </View>
        <Divider style={styles(colors).divider} />
        <Text style={styles(colors).formHeader}>How long have you been experiencing symptoms?</Text>
        <FormInput
          labelName='Symptoms timeline'
          value={symptomTimeline}
          autoCapitalize='none'
          onChangeText={timeline => setSymptomTimeline(timeline)}
        />
        <Divider style={styles(colors).divider} />
        <Text style={styles(colors).formHeader}>Please list other medications you are taking and for how long</Text>
        <View style={styles(colors).commentsContainer}>
          <FormComments
            labelName='Medications'
            value={medications}
            onChangeText={medicationList => setMedications(medicationList)}
          />
          <Divider style={styles(colors).divider} />
          <Text style={styles(colors).formHeader}>Other Comments</Text>
          <FormComments
            labelName='Comments'
            value={comments}
            onChangeText={comment => setComments(comment)}
          />
        </View>
        <View style={styles(colors).signUpButtonContainer}>
          <FormButton
            title='Sign Up'
            modeValue='contained'
            labelStyle={styles(colors).signUpButtonLabel}
            onPress={() => {
                setIsLoding(true);
                register(firstName, lastName, email, password, condition, painLevel, symptomTimeline, medications, comments);
              }
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  commentsContainer: {
    marginLeft: 12,
    marginRight: 12,
  },
  form: {
    // backgroundColor: '#2F3243',
    flex: 1,
    justifyContent: 'center',
    marginRight: 25,
    marginLeft: 25,
    marginTop: 20,
    marginBottom: 40,
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10
  },
  signUpButtonLabel: {
    fontSize: 22,
    color: colors.buttonText,
  },
  signUpButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  navButtonText: {
    fontSize: 18
  },
  navButton: {
    marginTop: 10
  },
  formHeader: {
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'left',
    alignSelf: 'stretch',
    color : colors.text,
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.text,
    marginLeft: 10,
    marginRight: 10,
  },
  spinnerTextStyle: {
    color: colors.text
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.formBackground,
    margin: 20,
    borderRadius: 5,
  },
  picker: {
    backgroundColor: 'transparent',
    width: '100%',
    color: colors.text,
  },
  pickerItems: {
    color: colors.text,
  }, 
  pickerIcon: {
    position: 'absolute',
    right: '10%',
    color: colors.text,
  },
});