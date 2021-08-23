import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import NavFooter from '../components/NavFooter';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';


export default function ResourcesScreen({ navigation }) {
    let {colors, isDark} = useTheme();
    return (
    <View style={styles(colors).container}>
        <View style={styles(colors).content}>
            <Card style={styles(colors).card}>
                <Card.Title
                title='Sent From My Team'
                titleStyle={styles(colors).cardTitle}
                />
                <Divider style={styles(colors).divider}></Divider>
                <Card.Content>
                <Title style={styles(colors).cardSubTitle}>Latest Message:</Title>
                <Paragraph style={styles(colors).cardText}>Sent resource</Paragraph>
                </Card.Content>
            </Card>
            <Card style={styles(colors).card}>
                <Card.Title
                title='My Saved Resources'
                titleStyle={styles(colors).cardTitle}
                />
                <Divider style={styles(colors).divider}></Divider>
                <Card.Content>
                <Title style={styles(colors).cardSubTitle}>Latest Message:</Title>
                <Paragraph style={styles(colors).cardText}>Saved resource</Paragraph>
                </Card.Content>
            </Card>
        </View>
        <NavFooter
          navigation={navigation}
          destA='About'
          destB='Resources'
          destC=''
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
    content: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
      },
      card: {
        width: '100%',
        backgroundColor: colors.backgroundShaded,
        marginBottom: 20,
      },
      cardTitle: {
        color: colors.text,
      },
      cardSubTitle: {
        color: colors.text,
        fontSize: 18,
      },
      cardText: {
        color: colors.text,
      },
      divider: {
        borderWidth: 1,
        borderColor: colors.text,
        marginTop: 5,
        marginBottom: 5,   
        marginLeft: 10,
        marginRight: 10 
      },
});