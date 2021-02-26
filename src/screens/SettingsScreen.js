import React from 'react';
import {View, StatusBar, Text, StyleSheet} from 'react-native';
import {useTheme} from '../navigation/ThemeProvider';
import {Toggle} from '../utils/toggleTheme';

export default function SettingsScreen(props, { navigation }) {
    const {children} = props;

    // Using the custom hook we made to pull the theme colors
    const {colors, isDark} = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            /* 
            * the colors.background value will change dynamicly with
            * so if we wanna change its value we can go directly to the pallet
            * this will make super easy to change and maintain mid or end project
            */
            backgroundColor: colors.background,
        },
        text: {
            color: colors.text,
            fontSize: 30,
        }
    });

    return (
        <>
            {/* We can also use the isDark prop to set the statusbar style accordingly */}
            <StatusBar animated barStyle={isDark ? "light-content" : "dark-content"}/>
            <View style={styles.container}>
                {children}
                <Text style={styles.text}>{isDark ? "Dark Mode" : "Light Mode"}</Text>
                <View>{Toggle()}</View>
            </View>
        </>
    );
}