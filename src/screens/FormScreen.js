import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Divider, Checkbox, Card, TextInput } from 'react-native-paper';
import FormComments from '../components/FormComments';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import NavFooter from '../components/NavFooter';
import { IconButton } from 'react-native-paper';
import  DropDown  from  'react-native-paper-dropdown';
import { OBJECTMEMBER_TYPES } from '@babel/types';

export default function FormScreen({ navigation }) {
    let {colors, isDark} = useTheme();
    const [comments, setComments] = useState('');
    const [formSymptoms, setFormSymptoms] = useState([]);
    const { submitForm, userInfo } = useContext(AuthContext);
    const [open, setOpen] = useState({});
    const [symptoms, setSymptoms] = useState({});
    const [numbers, setNumbers] = useState([
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '9', value: '9'},
        {label: '10', value: '10'},
      ]);

    function handleChange(name, value) {
        setSymptoms(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleDropdown(name, bool) {
        setOpen(prevState => ({
            ...prevState,
            [name]: bool
        }));
    }

    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
          if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
          return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }

    function getPatientForm(){
        console.log(userInfo.formType);
        var openHolder = {};
        var symptomsHolder = {};
        var formSymptomsHolder = [
            {'title': 'Anxiety', 'var': camelize('Anxiety')},
            {'title': 'Depression', 'var': camelize('Despression')},
            {'title': 'Fatigue', 'var': camelize('Fatigue')},
            {'title': 'Memory', 'var': camelize('Memory')},
            {'title': 'Headaches', 'var': camelize('Headaches')},
            {'title': 'Nausea', 'var': camelize('Nausea')},
            {'title': 'Constipation', 'var': camelize('Constipation')},
            {'title': 'Heartburn', 'var': camelize('Heartburn')},
            {'title': 'Swelling', 'var': camelize('Swelling')},
            {'title': 'Insomnia', 'var': camelize('Insomnia')},
            {'title': 'Pain', 'var': camelize('Pain')},
            {'title': 'Neuropathy', 'var': camelize('Neuropathy')},
            {'title': 'Aches', 'var': camelize('Aches')},
            {'title': 'Eczema', 'var': camelize('Eczema')},
            {'title': 'Rash', 'var': camelize('Rash')},
            {'title': 'Dry Skin/Hair', 'var': 'drySkinHair'},
            {'title': 'Acne', 'var': camelize('Acne')},
            {'title': 'Brain Fog', 'var': camelize('Brain Fog')},
            {'title': 'Irregular Periods', 'var': camelize('Irregular Periods')},
            {'title': 'Dizziness', 'var': camelize('Dizziness')},
            {'title': 'Inflammation', 'var': camelize('Inflammation')},
            {'title': 'PMS Symptoms', 'var': 'pmsSymptoms'},
            {'title': 'Weight Control', 'var': camelize('Weight Control')},
            {'title': 'Vivid Dreams', 'var': camelize('Vivid Dreams')},
        ];
        setFormSymptoms(formSymptomsHolder);
        for(const item of formSymptoms){
            openHolder[item.var] = false;
            symptomsHolder[item.var] = '0';
        }
        setSymptoms(symptomsHolder);
        setOpen(openHolder);
    }

    useEffect(() => {
        if(Object.keys(symptoms).length == 0){
            getPatientForm();
        }
    },[formSymptoms]);

    return (
    <View style={styles(colors).container}>
        <ScrollView style={styles(colors).form} contentContainerStyle={styles(colors).formContainer}>
            <View style={styles(colors).textBox}>
                <IconButton style={styles(colors).notificationIcon} icon={'alert-circle'} size={30}/>
                <Text style={styles(colors).disclaimer}>Please find the symptoms you are treating with LDN below and rate them. </Text>
            </View>
            <View style={styles(colors).textBox}>
                <Text style={styles(colors).disclaimer}>Scale: 0(none) - 10(severe)</Text>
            </View>
            <View style={styles(colors).formQuestions}>
                <Card style={styles(colors).cards}>
                    <Text style={styles(colors).cardTitle}>Symptoms</Text>
                    {
                    formSymptoms.map(formItem => {
                        return <View style={styles(colors).symptomBox}>
                                    <Text style={styles(colors).symptomText}>{formItem.title}</Text>
                                    <View style={styles(colors).dropdown}>
                                        <DropDown
                                            label={'0'}
                                            defaultValue={'0'}
                                            mode={'outlined'}
                                            value={symptoms[formItem.var]}
                                            setValue={event => handleChange(formItem.var,event)}
                                            list={numbers}
                                            visible={open[formItem.var]}
                                            dropDownContainerMaxHeight={300}
                                            showDropDown={() =>  handleDropdown(formItem.var, true)}
                                            onDismiss={() =>  handleDropdown(formItem.var, false)}
                                            inputProps={{
                                                right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                            }}
                                        />
                                    </View>
                                </View>
                    })
                    }
                </Card>
                <FormComments
                    labelName='Other comments or side effects?'
                    value={comments}
                    onChangeText={comment => setComments(comment)}
                    style={styles(colors).comments}
                    placeholderTextColor = "#555"
                />
            </View>
            <View style={styles(colors).submit}>
                <FormButton
                title='Submit'
                modeValue='contained'
                labelStyle={styles(colors).submitButtonLabel}
                onPress={() => {
                    // console.log(JSON.stringify(symptoms));
                    submitForm(symptoms, comments)
                    navigation.navigate('Home')
                }}
                />
            </View>
        </ScrollView>
        <NavFooter
          navigation={navigation}
          destA='TeamHome'
          destB='Messages'
          destC=''
          iconA='account-details'
          iconB='message'
          iconC='folder-information'
          />
    </View>
    );
}

const styles = (colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        // justifyContent: 'space-between',
    },
    disclaimer: {
        flex: 1, 
        flexWrap: 'wrap',
        fontSize: 18,
        padding: 10,
        color: colors.notificationText,
        fontStyle: 'italic',
    },
    notificationIcon: {
        marginRight: 0,
        paddingRight: 0,
    },
    dropdown: {
        backgroundColor: 'transparent', 
        borderColor: 'transparent', 
        width: '30%',
        overflow: 'scroll',
    },
    dropdownIcon: {
        color: 'black',
    },
    textBox: {
        backgroundColor: colors.notificationBackground,
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row'
    },
    symptomBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
    },
    symptomText:{
        fontSize: 22,
        maxWidth: 200,
    },
    formContainer: {
        padding: 20,
    },
    form: {
        height: '100%',
    },
    comments: {
        width: '100%',
        backgroundColor: colors.formBackground,
        height: 100,
        borderRadius: 5,
        padding: 10,
    },
    submit: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    submitButtonLabel: {
        fontSize: 22,
        color: '#fff',
    },
    cards: {
        flex: 1,
        padding: 5,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: colors.formBackground,
    },
    cardTitle: {
        fontSize: 22,
        marginBottom: 10,
        fontWeight: 'bold',
        padding: 10,
    }
});