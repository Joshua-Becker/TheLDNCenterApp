import React, { useCallback } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function useStatusBar(style, animated = true) {
    console.log('statusBarHeight: ', StatusBar.currentHeight);
    useFocusEffect(
      useCallback(() => {
        if(Platform.OS === 'ios') {
          StatusBar.setBarStyle(style, animated);
        } else if(Platform.OS === 'android') {
          StatusBar.setBarStyle('light-content', animated);
          StatusBar.setBackgroundColor('#171921', animated);
        } else{
          StatusBar.setBarStyle(style, animated);
          StatusBar.setbar
        }
      }, [])
    );
}