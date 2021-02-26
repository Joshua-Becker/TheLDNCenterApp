import React, { useEffect, useCallback } from 'react';
import {View, StatusBar, Text, StyleSheet, Switch} from 'react-native';
import {useTheme} from '../navigation/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen(props) {
    const {children} = props;
    //props.navigation.setParams({ backgroundColor: '#ccc' })
    // Using the custom hook we made to pull the theme colors
    let {colors, isDark} = useTheme();
    const {setScheme} = useTheme();
    const toggleScheme = () => {
        /*
        * setScheme will change the state of the context
        * thus will cause childrens inside the context provider to re-render
        * with the new color scheme
        */
        isDark ? setScheme('light') : setScheme('dark');
    }

    async function storeColorSceme(isDark) {
        try {
            if(isDark){
                AsyncStorage.setItem('@color_theme', 'dark');
            } else {
                AsyncStorage.setItem('@color_theme', 'light');
            }
        } catch (e) {
            console.log('[SettingScreen] Error saving settings: ' + e);
        }
    }

    useEffect(() => {
        if(isDark){
            props.navigation.setOptions({
                headerStyle: {
                    backgroundColor: colors.navBar,
                },
            });
        } else {
            props.navigation.setOptions({
                headerStyle: {
                    backgroundColor: colors.navBar,
                    },
            });
        }
        storeColorSceme(isDark);
    }, [isDark]);

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
            <StatusBar 
                barStyle={isDark ? "light-content" : "light-content"} 
                backgroundColor={isDark? colors.statusBar : colors.statusBar}/>
            <View style={styles.container}>
                {children}
                <Text style={styles.text}>{isDark ? "Dark Mode" : "Light Mode"}</Text>
                <Switch value={isDark} onValueChange={toggleScheme}/>
            </View>
        </>
    );
}