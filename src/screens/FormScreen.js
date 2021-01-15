import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Title, IconButton } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

export default function FormScreen({ navigation }) {
  const [painLevel, setPainLevel] = useState(0);
  const { submitForm } = useContext(AuthContext);

  return (
    <View style={styles.container}>
        <View style={styles.center}>
            <Title style={styles.titleText}>Biweekly Form</Title>
        </View>
        <View style={styles.formQuestions}>
            <Text style={styles.formText}>Pain Level</Text>
            <Picker selectedValue={painLevel} style={{width: '100%'}} onValueChange={(itemValue, itemIndex) => setPainLevel(itemValue)}>
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
        </View>
        <View style={styles.center}>
            <FormButton
            title='Submit'
            modeValue='contained'
            labelStyle={styles.loginButtonLabel}
            onPress={() => {
                submitForm(painLevel)
                navigation.navigate('Home')
            }}
            />
            <IconButton
            icon='keyboard-backspace'
            size={30}
            style={styles.navButton}
            color='#0C5FAA'
            onPress={() => navigation.goBack()}
            />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
    },
    center: {
        alignItems: 'center'
    },
    formContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        textAlign: 'left',
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
    },
    formText: {
     fontSize: 18,
    },
    formQuestions: {

    },
});