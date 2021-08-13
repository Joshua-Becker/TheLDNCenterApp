import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import NavFooter from '../components/NavFooter';


export default function ResourcesScreen({ navigation }) {
    let {colors, isDark} = useTheme();
    return (
    <View style={styles(colors).container}>
        <Text style={styles(colors).warningTitle}>About Screen</Text>
        <NavFooter
          navigation={navigation}
          destA=''
          destB='Resources'
          destC='MyResources'
          iconA='card-account-details'
          iconB='bookshelf'
          iconC='content-save'
          />
    </View>
    );
}

const styles = (colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'space-between',
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