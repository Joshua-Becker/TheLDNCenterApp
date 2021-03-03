import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';

export default function FormScreen({ navigation }) {
    let {colors, isDark} = useTheme();
    const [email, setEmail] = useState();
    const { forgotPassword } = useContext(AuthContext);

    return (
    <View style={styles(colors).container}>
        <View></View>
        <View>
            <View style={styles(colors).warningContainer}>
                <Text style={styles(colors).warningTitle}>Warning!</Text>
                <Text>
                    For your security, resetting your password may result in deletion of all your LDN Center App messages.
                </Text>
            </View>
            <FormInput
                labelName='Entert email'
                value={email}
                autoCapitalize='none'
                onChangeText={userEmail => setEmail(userEmail)}
            />
        </View>
        <View style={styles(colors).submit}>
            <FormButton
            title='Send Email'
            modeValue='contained'
            labelStyle={styles(colors).submitButtonLabel}
            onPress={() => {
                forgotPassword(email)
                navigation.navigate('Login')
            }}
            />
        </View>
    </View>
    );
}

const styles = (colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    warningContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'red',
        backgroundColor: 'pink',
        padding: 20,
    },
    warningTitle: {
        fontSize: 20,
        textAlign: 'center',
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
});