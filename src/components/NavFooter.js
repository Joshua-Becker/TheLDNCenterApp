import React from 'react';
import { StyleSheet, Dimensions, View, Platform } from 'react-native';
import {useTheme} from '../navigation/ThemeProvider';
import { IconButton } from 'react-native-paper';

const { width, height } = Dimensions.get('screen');

export default function NavFooter({ navigation, destA, destB, destC, iconA, iconB, iconC, ...otherStyles}) {
  const {colors, isDark} = useTheme();
  return (
    <View style={styles(colors).container}>
        <IconButton 
            onPress={() => {
                if(destA != ''){
                    navigation.push(destA)}
                }
            } 
            style={destA != '' ? styles(colors).icon : styles(colors).iconCurrent} 
            icon={iconA} 
            color='white' 
            size={35} 
            {...otherStyles}/>
        <IconButton 
            onPress={() => {
                if(destB != ''){
                    navigation.push(destB)}
                }
            } 
            style={destB != '' ? styles(colors).icon : styles(colors).iconCurrent}  
            icon={iconB}
            color='white' 
            size={35} 
            {...otherStyles}/>
        <IconButton 
            onPress={() => {
                if(destC != ''){
                    navigation.push(destC)}
                }
            } 
            style={destC != '' ? styles(colors).icon : styles(colors).iconCurrent}  
            icon={iconC} 
            color='white' 
            size={35} 
            {...otherStyles}/>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.footerNav,
        paddingBottom: Platform.OS === 'ios' ? 25 : 0,
    },
    icon: {
        flex: 1,
        margin: 0,
    },
    iconCurrent: {
        flex: 1,
        backgroundColor: colors.accent,
        borderRadius: 0,
        margin: 0,
    }
});