import React, { useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Divider, Checkbox, Card } from 'react-native-paper';
import FormComments from '../components/FormComments';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';

export default function FormScreen({ navigation }) {
    let {colors, isDark} = useTheme();
    const [painLevel, setPainLevel] = useState(0);
    const [sideEffects, setSideEffects] = useState([]);
    const { submitForm } = useContext(AuthContext);
    const [sdChecked, setSDChecked] = React.useState(false);
    const [vdChecked, setVDChecked] = React.useState(false);
    const [usChecked, setUSChecked] = React.useState(false);
    const [aChecked, setAChecked] = React.useState(false);
    const [hChecked, setHChecked] = React.useState(false);
    const [comments, setComments] = useState('');

    return (
    <View style={styles(colors).container}>
        <ScrollView style={styles(colors).form} contentContainerStyle={styles(colors).formContainer}>
            <View style={styles(colors).formQuestions}>
                <Card style={styles(colors).cards}>
                    <Text style={styles(colors).formHeader}>Pain Level</Text>
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
                    <Divider style={styles(colors).divider}></Divider>
                </Card>
                <Card style={styles(colors).cards}>
                    <Text style={styles(colors).formHeader}>Side Effects</Text>
                    <Text style={styles(colors).formSubtext}>Select all that apply (Skip if not applicable)</Text>
                    <TouchableOpacity 
                    style={styles(colors).checkbox} 
                    onPress={() => {
                    setSDChecked(!sdChecked);
                    setSideEffects(oldArray => [...oldArray, 'Sleep Disturbances']);
                    }}
                    >
                        <Checkbox
                            status={sdChecked ? 'checked' : 'unchecked'}
                        />
                        <Text>Sleep Disturbances</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={styles(colors).checkbox}
                    onPress={() => {
                    setVDChecked(!vdChecked);
                    setSideEffects(oldArray => [...oldArray, 'Vivid Dreams']);
                    }}
                    >
                        <Checkbox
                            status={vdChecked ? 'checked' : 'unchecked'}
                        />
                        <Text>Vivid Dreams</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={styles(colors).checkbox}
                    onPress={() => {
                    setUSChecked(!usChecked);
                    setSideEffects(oldArray => [...oldArray, 'Upset Stomach']);
                    }}
                    >
                        <Checkbox
                            status={usChecked ? 'checked' : 'unchecked'}

                        />
                        <Text>Upset Stomach</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={styles(colors).checkbox}
                    onPress={() => {
                    setAChecked(!aChecked);
                    setSideEffects(oldArray => [...oldArray, 'Anxiety']);
                    }}
                    >
                        <Checkbox
                            status={aChecked ? 'checked' : 'unchecked'}
                        />
                        <Text>Anxiety</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={styles(colors).checkbox} 
                    onPress={() => {
                    setHChecked(!hChecked);
                    setSideEffects(oldArray => [...oldArray, 'Headaches']);
                    }}
                    >
                        <Checkbox
                            status={hChecked ? 'checked' : 'unchecked'}
                        />
                        <Text>Headaches</Text>
                    </TouchableOpacity>
                </Card>
                <FormComments
                    labelName='Other Comments'
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
                    submitForm(painLevel, sideEffects, comments)
                    navigation.navigate('Home')
                }}
                />
            </View>
        </ScrollView>
    </View>
    );
}

const styles = (colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        // justifyContent: 'space-between',
        padding: 20,
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
    formQuestions: {
    },
    submitButtonLabel: {
        fontSize: 22,
        color: '#fff',
    },
    formHeader: {
     fontSize: 18,
     marginTop: 10,
     marginBottom: 5,
    },
    formText: {
        fontSize: 18,
    },
    formSubtext: {
        fontSize: 15,
        color: 'gray'
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        marginTop: 15,
        marginBottom: 15,
    },
    cards: {
        flex: 1,
        padding: 5,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: colors.formBackground,
    }
});