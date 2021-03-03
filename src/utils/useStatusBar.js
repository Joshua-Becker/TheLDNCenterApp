import React, { useCallback } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {useTheme} from '../navigation/ThemeProvider';

export default function useStatusBar() {
  const {colors, isDark} = useTheme();
  // const isDark = true;
  useFocusEffect(
    useCallback(() => {
      if(Platform.OS === 'ios') {
        if(isDark){
          StatusBar.setBarStyle('light-content', true);
          //StatusBar.setBackgroundColor(colors.statusBar, true);
        } else {
          StatusBar.setBarStyle('light-content', true);
          //StatusBar.setBackgroundColor(colors.statusBar, true);
        }
      } else if(Platform.OS === 'android') {
        if(isDark){
          StatusBar.setBarStyle('light-content', true);
          StatusBar.setBackgroundColor(colors.statusBar, true);
        } else {
          StatusBar.setBarStyle('light-content', true);
          StatusBar.setBackgroundColor(colors.statusBar, true);
        }
      } else{
        if(isDark){
          StatusBar.setBarStyle('light-content', true);
          StatusBar.setBackgroundColor(colors.statusBar, true);
        } else {
          StatusBar.setBarStyle('light-content', true);
          StatusBar.setBackgroundColor(colors.statusBar, true);
        }
      }
    }, [])
  );
}