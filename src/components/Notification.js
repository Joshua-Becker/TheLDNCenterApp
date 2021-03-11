import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, Platform, Text, View } from 'react-native';
import {useTheme} from '../navigation/ThemeProvider';
import { IconButton } from 'react-native-paper';

const { width, height } = Dimensions.get('screen');

export default function Notification({ navigation, text, link, ...otherStyles}) {
  const {colors, isDark} = useTheme();
  return (
    <TouchableOpacity onPress={()=> navigation.navigate(link)} style={styles(colors).notificationContainer}>
        <IconButton style={styles(colors).notificationIcon} icon={'alert-circle'} size={30}/>
        <Text style={styles(colors).notificationText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = (colors) => StyleSheet.create({
    notificationContainer: {
        backgroundColor: colors.notificationBackground,
        width: width * 0.9,
        borderRadius: 5,
        padding: 2,
        marginBottom: 10,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    notificationIcon: {
        margin: 0,
        color: colors.notificationText,
    },
    notificationText: {
        color: colors.notificationText,
        fontSize: 18,
        textAlign: 'center',
    },
});