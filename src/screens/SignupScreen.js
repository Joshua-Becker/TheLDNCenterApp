import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import drugList from '../components/DrugList.json';
import {Picker} from '@react-native-picker/picker';
import FormComments from '../components/FormComments';
import {Divider} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import useStatusBar from '../utils/useStatusBar';
import {IconButton} from 'react-native-paper';
import {useTheme} from '../navigation/ThemeProvider';
import DropDownPicker from 'react-native-dropdown-picker';

export default function SignupScreen({navigation}) {
  const {colors, isDark} = useTheme();
  useStatusBar();
  const [page, setPage] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [condition, setCondition] = useState('');
  const [drugAllergies, setDrugAllergies] = useState('');
  const {register} = useContext(AuthContext);
  const [painLevel, setPainLevel] = useState(0);
  const [symptomTimeline, setSymptomTimeline] = useState('');
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoding] = useState(false);
  const [openMeds, setOpenMeds] = useState(false);
  const [medValue, setMedValue] = useState(null);
  const [medItems, setMedItems] = useState(drugList['data']);

  function registerFilter(
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    condition,
    drugAllergies,
    painLevel,
    symptomTimeline,
    medications,
    comments,
  ) {
    if (password.length < 8) {
      alert(
        'Password must be least 8 characters in length and contain at least 1 number, special character, and capital letter.',
      );
      setIsLoding(false);
      return;
    }
    const capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '[]&/|!@^-_=`#,+()$~%.:*?<>{}';
    let hasCapitalLetter = false;
    let hasNumber = false;
    let hasSpecialChar = false;
    for (let i = 0; i < password.length; i++) {
      if (capitals.includes(password[i])) {
        hasCapitalLetter = true;
      }
      if (numbers.includes(password[i])) {
        hasNumber = true;
      }
      if (specialChars.includes(password[i])) {
        hasSpecialChar = true;
      }
    }
    if (!hasCapitalLetter || !hasNumber || !hasSpecialChar) {
      alert(
        'Password must be least 8 characters in length and contain at least 1 number, special character, and capital letter.',
      );
      setIsLoding(false);
      return;
    }
    register(
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      condition,
      drugAllergies,
      painLevel,
      symptomTimeline,
      medications,
      comments,
    );
  }

  function setPhoneFilter(text) {
    let newText = '';
    let numbers = '0123456789';

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        // your call back function
        alert('Please enter numbers only');
      }
    }
    setPhone(newText);
  }

  // useEffect(() => {
  //   setIsLoding(false);
  //   console.log(drugList['data'][0]);
  // }, []);

  return (
    <KeyboardAvoidingView
      style={styles(colors).container}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
      keyboardVerticalOffset={Platform.select({
        ios: () => 10,
        android: () => 0,
      })()}>
      {page == 2 && (
        <View style={styles(colors).page2}>
          <FormInput
            labelName="Please list any drug allergies"
            value={drugAllergies}
            autoCapitalize="words"
            onChangeText={(userDrugAllergies) =>
              setDrugAllergies(userDrugAllergies)
            }
          />
          <Text style={styles(colors).formHeader}>
            Please select other medications you are taking. If you cannot find
            your medication then please list it in the comment section.
          </Text>
          <DropDownPicker
            open={openMeds}
            value={medValue}
            items={medItems}
            setOpen={setOpenMeds}
            setValue={setMedValue}
            setItems={setMedItems}
            multiple={true}
            searchable={true}
            listMode="FLATLIST"
            containerStyle={styles(colors).medications}
            listItemContainerStyle={styles(colors).medicationsListItem}
          />
          <Divider style={styles(colors).divider} />
          <View style={styles(colors).commentsContainer}>
            <Text style={styles(colors).formHeader}>Other Comments</Text>
            <FormComments
              labelName="Comments"
              value={comments}
              onChangeText={(comment) => setComments(comment)}
            />
          </View>
          <FormButton
            title="Go Back"
            modeValue="contained"
            labelStyle={styles(colors).signUpButtonLabel}
            onPress={() => {
              setPage(1);
            }}
          />
          <FormButton
            title="Sign Up"
            modeValue="contained"
            labelStyle={styles(colors).signUpButtonLabel}
            onPress={() => {
              setIsLoding(true);
              registerFilter(
                firstName,
                lastName,
                phoneNumber,
                email,
                password,
                condition,
                drugAllergies,
                painLevel,
                symptomTimeline,
                medValue,
                comments,
              );
            }}
          />
        </View>
      )}
      {page == 1 && (
        <ScrollView style={styles(colors).page1}>
          <Spinner
            visible={isLoading}
            textContent={'Loading...'}
            textStyle={styles(colors).spinnerTextStyle}
          />
          <View style={styles(colors).form}>
            <Divider style={styles(colors).dividerFirst} />
            <Text style={styles(colors).formHeader}>Basic Information</Text>
            <FormInput
              labelName="First name"
              value={firstName}
              autoCapitalize="words"
              onChangeText={(userFirstName) => setFirstName(userFirstName)}
            />
            <FormInput
              labelName="Last name"
              value={lastName}
              autoCapitalize="words"
              onChangeText={(userLastName) => setLastName(userLastName)}
            />
            <FormInput
              labelName="Phone Number"
              value={phoneNumber}
              keyboardType="numeric"
              maxLength={15}
              onChangeText={(phone) => setPhoneFilter(phone)}
            />
            <FormInput
              labelName="Email"
              value={email}
              autoCapitalize="none"
              onChangeText={(userEmail) => setEmail(userEmail)}
            />
            <FormInput
              labelName="Password"
              value={password}
              secureTextEntry={true}
              autoCapitalize="none"
              onChangeText={(userPassword) => setPassword(userPassword)}
            />
            <FormInput
              labelName="Current medical condition(s)"
              value={condition}
              autoCapitalize="words"
              onChangeText={(userCondition) => setCondition(userCondition)}
            />
            <Divider style={styles(colors).divider} />
            <Text style={styles(colors).formHeader}>
              Current level of pain or discomfort
            </Text>
            <View style={styles(colors).pickerContainer}>
              <Picker
                style={styles(colors).picker}
                itemStyle={styles(colors).pickerItems}
                selectedValue={painLevel}
                onValueChange={(itemValue, itemIndex) =>
                  setPainLevel(itemValue)
                }>
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
                icon="arrow-down-drop-circle"
                size={15}
                color="#fff"
                style={styles(colors).pickerIcon}
              />
            </View>
            <Divider style={styles(colors).divider} />
            <Text style={styles(colors).formHeader}>
              How long have you been experiencing symptoms?
            </Text>
            <FormInput
              labelName="Symptoms timeline"
              value={symptomTimeline}
              // autoCapitalize='none'
              onChangeText={(timeline) => setSymptomTimeline(timeline)}
            />
            <View style={styles(colors).signUpButtonContainer}>
              <FormButton
                title="Next"
                modeValue="contained"
                labelStyle={styles(colors).signUpButtonLabel}
                onPress={() => {
                  setPage(2);
                }}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#000000',
      paddingBottom: 20,
    },
    page2: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    commentsContainer: {
      marginLeft: 5,
      marginRight: 5,
    },
    form: {
      // backgroundColor: '#2F3243',
      flex: 1,
      justifyContent: 'center',
      marginRight: 5,
      marginLeft: 5,
      marginTop: 20,
      marginBottom: 40,
    },
    titleText: {
      fontSize: 24,
      marginBottom: 10,
    },
    signUpButtonLabel: {
      fontSize: 22,
      lineHeight: 21,
      color: colors.buttonText,
    },
    signUpButtonContainer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    navButtonText: {
      fontSize: 18,
    },
    navButton: {
      marginTop: 10,
    },
    formHeader: {
      marginLeft: 15,
      marginRight: 15,
      textAlign: 'left',
      alignSelf: 'stretch',
      color: colors.text,
    },
    divider: {
      marginTop: 30,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: colors.text,
      marginLeft: 15,
      marginRight: 15,
    },
    dividerFirst: {
      marginTop: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: colors.text,
      marginLeft: 15,
      marginRight: 15,
    },
    spinnerTextStyle: {
      color: colors.text,
    },
    pickerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.formBackground,
      margin: 15,
      borderRadius: 5,
    },
    picker: {
      backgroundColor: 'transparent',
      width: '100%',
      color: '#000000',
    },
    pickerItems: {
      color: '#000000',
    },
    pickerIcon: {
      position: 'absolute',
      right: '10%',
      color: '#000000',
    },
    medications: {
      marginTop: 20,
      width: '95%',
      alignSelf: 'center',
      zIndex: 10,
    },
    medicationsListItem: {
      lineHeight: 80,
      height: 60,
      overflow: 'scroll',
    },
  });
