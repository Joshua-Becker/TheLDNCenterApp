import React, { useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Divider, Checkbox, Card, TextInput } from 'react-native-paper';
import FormComments from '../components/FormComments';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import NavFooter from '../components/NavFooter';
import { IconButton } from 'react-native-paper';
import  DropDown  from  'react-native-paper-dropdown';

export default function FormScreen({ navigation }) {
    let {colors, isDark} = useTheme();
    const [comments, setComments] = useState('');
    const { submitForm } = useContext(AuthContext);
    const [open, setOpen] = useState({
        'anxiety': false,
        'depression': false,
        'fatigue': false,
        'memory': false,
        'headaches': false,
        'nausea': false,
        'constipation': false,
        'heartburn': false,
        'swelling': false,
        'insomnia': false,
        'pain': false,
        'neuropathy': false,
        'aches': false,
        'eczema': false,
        'rash': false,
        'drySkinHair': false,
        'acne': false,
        'brainFog': false,
        'irregularPeriods': false,
        'dizziness': false,
        'inflammation': false,
        'pmsSymptoms': false,
        'weightControl': false,
        'vividDreams': false,
    });
    const [symptoms, setSymptoms] = useState({
        'anxiety': '0',
        'depression': '0',
        'fatigue': '0',
        'memory': '0',
        'headaches': '0',
        'nausea': '0',
        'constipation': '0',
        'heartburn': '0',
        'swelling': '0',
        'insomnia': '0',
        'pain': '0',
        'neuropathy': '0',
        'aches': '0',
        'eczema': '0',
        'rash': '0',
        'drySkinHair': '0',
        'acne': '0',
        'brainFog': '0',
        'irregularPeriods': '0',
        'dizziness': '0',
        'inflammation': '0',
        'pmsSymptoms': '0',
        'weightControl': '0',
        'vividDreams': '0',
    });
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
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Anxiety</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.anxiety}
                                setValue={event => handleChange('anxiety',event)}
                                list={numbers}
                                visible={open.anxiety}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('anxiety', true)}
                                onDismiss={() =>  handleDropdown('anxiety', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Depression</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.depression}
                                setValue={event => handleChange('depression',event)}
                                list={numbers}
                                visible={open.depression}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('depression', true)}
                                onDismiss={() =>  handleDropdown('depression', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Fatigue</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.fatigue}
                                setValue={event => handleChange('fatigue',event)}
                                list={numbers}
                                visible={open.fatigue}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('fatigue', true)}
                                onDismiss={() =>  handleDropdown('fatigue', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Memory</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.memory}
                                setValue={event => handleChange('memory',event)}
                                list={numbers}
                                visible={open.memory}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('memory', true)}
                                onDismiss={() =>  handleDropdown('memory', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Headaches</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.headaches}
                                setValue={event => handleChange('headaches',event)}
                                list={numbers}
                                visible={open.headaches}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('headaches', true)}
                                onDismiss={() =>  handleDropdown('headaches', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Nausea</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.nausea}
                                setValue={event => handleChange('nausea',event)}
                                list={numbers}
                                visible={open.nausea}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('nausea', true)}
                                onDismiss={() =>  handleDropdown('nausea', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Constipation</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.constipation}
                                setValue={event => handleChange('constipation',event)}
                                list={numbers}
                                visible={open.constipation}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('constipation', true)}
                                onDismiss={() =>  handleDropdown('constipation', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Heartburn</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.heartburn}
                                setValue={event => handleChange('heartburn',event)}
                                list={numbers}
                                visible={open.heartburn}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('heartburn', true)}
                                onDismiss={() =>  handleDropdown('heartburn', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Swelling</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.swelling}
                                setValue={event => handleChange('swelling',event)}
                                list={numbers}
                                visible={open.swelling}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('swelling', true)}
                                onDismiss={() =>  handleDropdown('swelling', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Insomnia</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.insomnia}
                                setValue={event => handleChange('insomnia',event)}
                                list={numbers}
                                visible={open.insomnia}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('insomnia', true)}
                                onDismiss={() =>  handleDropdown('insomnia', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Pain</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.pain}
                                setValue={event => handleChange('pain',event)}
                                list={numbers}
                                visible={open.pain}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('pain', true)}
                                onDismiss={() =>  handleDropdown('pain', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Neuropathy</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.neuropathy}
                                setValue={event => handleChange('neuropathy',event)}
                                list={numbers}
                                visible={open.neuropathy}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('neuropathy', true)}
                                onDismiss={() =>  handleDropdown('neuropathy', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Aches</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.aches}
                                setValue={event => handleChange('aches',event)}
                                list={numbers}
                                visible={open.aches}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('aches', true)}
                                onDismiss={() =>  handleDropdown('aches', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Eczema</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.eczema}
                                setValue={event => handleChange('eczema',event)}
                                list={numbers}
                                visible={open.eczema}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('eczema', true)}
                                onDismiss={() =>  handleDropdown('eczema', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Rash</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.rash}
                                setValue={event => handleChange('rash',event)}
                                list={numbers}
                                visible={open.rash}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('rash', true)}
                                onDismiss={() =>  handleDropdown('rash', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Dry Skin/Hair</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.drySkinHair}
                                setValue={event => handleChange('drySkinHair',event)}
                                list={numbers}
                                visible={open.drySkinHair}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('drySkinHair', true)}
                                onDismiss={() =>  handleDropdown('drySkinHair', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Acne</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.acne}
                                setValue={event => handleChange('acne',event)}
                                list={numbers}
                                visible={open.acne}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('acne', true)}
                                onDismiss={() =>  handleDropdown('acne', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Brain Fog</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.brainFog}
                                setValue={event => handleChange('brainFog',event)}
                                list={numbers}
                                visible={open.brainFog}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('brainFog', true)}
                                onDismiss={() =>  handleDropdown('brainFog', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Irregular Periods</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.irregularPeriods}
                                setValue={event => handleChange('irregularPeriods',event)}
                                list={numbers}
                                visible={open.irregularPeriods}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('irregularPeriods', true)}
                                onDismiss={() =>  handleDropdown('irregularPeriods', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Dizziness</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.dizziness}
                                setValue={event => handleChange('dizziness',event)}
                                list={numbers}
                                visible={open.dizziness}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('dizziness', true)}
                                onDismiss={() =>  handleDropdown('dizziness', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Inflammation</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.inflammation}
                                setValue={event => handleChange('inflammation',event)}
                                list={numbers}
                                visible={open.inflammation}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('inflammation', true)}
                                onDismiss={() =>  handleDropdown('inflammation', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>PMS Symptoms</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.pmsSymptoms}
                                setValue={event => handleChange('pmsSymptoms',event)}
                                list={numbers}
                                visible={open.pmsSymptoms}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('pmsSymptoms', true)}
                                onDismiss={() =>  handleDropdown('pmsSymptoms', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Weight Control</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.weightControl}
                                setValue={event => handleChange('weightControl',event)}
                                list={numbers}
                                visible={open.weightControl}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('weightControl', true)}
                                onDismiss={() =>  handleDropdown('weightControl', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles(colors).symptomBox}>
                        <Text style={styles(colors).symptomText}>Vivid Dreams</Text>
                        <View style={styles(colors).dropdown}>
                            <DropDown
                                label={'0'}
                                defaultValue={'0'}
                                mode={'outlined'}
                                value={symptoms.weightControl}
                                setValue={event => handleChange('vividDreams',event)}
                                list={numbers}
                                visible={open.vividDreams}
                                dropDownContainerMaxHeight={300}
                                showDropDown={() =>  handleDropdown('vividDreams', true)}
                                onDismiss={() =>  handleDropdown('vividDreams', false)}
                                inputProps={{
                                    right:  <TextInput.Icon  name={'menu-down'} style={styles(colors).dropdownIcon} size={30} />,
                                }}
                            />
                        </View>
                    </View>
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
                    console.log(JSON.stringify(symptoms))
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
        fontSize: 18,
        padding: 10,
        lineHeight: 20,
        color: colors.notificationText,
        width: 270,
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
        flexDirection: 'row',
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
        margin: 20,
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