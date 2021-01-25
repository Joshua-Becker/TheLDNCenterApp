import React, { useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Divider, Checkbox, Card } from 'react-native-paper';
import FormComments from '../components/FormComments';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

export default function FormScreen({ navigation }) {
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
    <ScrollView>
        <View style={styles.container}>
            <View style={styles.formQuestions}>
                <Card style={styles.cards}>
                    <Text style={styles.formHeader}>Pain Level</Text>
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
                    <Divider style={styles.divider}></Divider>
                </Card>
                <Card style={styles.cards}>
                    <Text style={styles.formHeader}>Side Effects</Text>
                    <Text style={styles.formSubtext}>Skip if not applicable</Text>
                    <View style={styles.checkbox}>
                        <Checkbox
                            status={sdChecked ? 'checked' : 'unchecked'}
                            onPress={() => {
                            setSDChecked(!sdChecked);
                            setSideEffects(oldArray => [...oldArray, 'Sleep Disturbances']);
                            }}
                        />
                        <Text>Sleep Disturbances</Text>
                    </View>
                    <View style={styles.checkbox}>
                        <Checkbox
                            status={vdChecked ? 'checked' : 'unchecked'}
                            onPress={() => {
                            setVDChecked(!vdChecked);
                            setSideEffects(oldArray => [...oldArray, 'Vivid Dreams']);
                            }}
                        />
                        <Text>Vivid Dreams</Text>
                    </View>
                    <View style={styles.checkbox}>
                        <Checkbox
                            status={usChecked ? 'checked' : 'unchecked'}
                            onPress={() => {
                            setUSChecked(!usChecked);
                            setSideEffects(oldArray => [...oldArray, 'Upset Stomach']);
                            }}
                        />
                        <Text>Upset Stomach</Text>
                    </View>
                    <View style={styles.checkbox}>
                        <Checkbox
                            status={aChecked ? 'checked' : 'unchecked'}
                            onPress={() => {
                            setAChecked(!aChecked);
                            setSideEffects(oldArray => [...oldArray, 'Anxiety']);
                            }}
                        />
                        <Text>Anxiety</Text>
                    </View>
                    <View style={styles.checkbox}>
                        <Checkbox
                            status={hChecked ? 'checked' : 'unchecked'}
                            onPress={() => {
                            setHChecked(!hChecked);
                            setSideEffects(oldArray => [...oldArray, 'Headaches']);
                            }}
                        />
                        <Text>Headaches</Text>
                    </View>
                </Card>
                <FormComments
                    labelName='Other Comments'
                    value={comments}
                    onChangeText={comment => setComments(comment)}
                />
            </View>
            <View style={styles.submit}>
                <FormButton
                title='Submit'
                modeValue='contained'
                labelStyle={styles.loginButtonLabel}
                onPress={() => {
                    submitForm(painLevel, sideEffects, comments)
                    navigation.navigate('Home')
                }}
                />
            </View>
        </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
        // justifyContent: 'space-between',
        padding: 20,
    },
    submit: {
        alignItems: 'center',
        marginTop: 50,
    },
    formQuestions: {
    },
    loginButtonLabel: {
        fontSize: 22
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
    }
});