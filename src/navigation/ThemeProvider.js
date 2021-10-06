import React, {useEffect, useState, createContext, useContext} from 'react';
import { Appearance } from 'react-native';
import {lightColors, darkColors} from '../utils/colorThemes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
    isDark: false,
    colors: lightColors,
    setScheme: () => {},
});

export const ThemeProvider = (props) => {
    // Getting the device color theme, this will also work with react-native-web
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    async function getColorScheme() {
        try {
            const storedColorScheme = await AsyncStorage.getItem('@color_theme')
            if(storedColorScheme == 'light') {
                setColorScheme('light');
            } else if(storedColorScheme == 'dark') {
                setColorScheme('dark'); 
            } else {
                // console.log('Not stored');
                // Color scheme not assigned in settings
            }
        } catch(e) {
            console.log('[ThemeProvider] Error getting color theme: ' + e);
        }
    }
    getColorScheme(); // Can be dark | light | no-preference

    /*
    * To enable changing the app theme dynamicly in the app (run-time)
    * we're gonna use useState so we can override the default device theme
    */
    const [isDark, setIsDark] = useState(colorScheme === "dark");

    // Listening to changes of device appearance while in run-time
    useEffect(() => {
        setIsDark(colorScheme === "dark");
    }, [colorScheme]);

    const defaultTheme = {
        isDark,
        // Chaning color schemes according to theme
        colors: isDark ? darkColors : lightColors,
        // Overrides the isDark value will cause re-render inside the context.  
        setScheme: (scheme) => setIsDark(scheme === "dark"),
    };

  return (
        <ThemeContext.Provider value={defaultTheme}>
            {props.children}
        </ThemeContext.Provider>
    );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useTheme = () => useContext(ThemeContext);