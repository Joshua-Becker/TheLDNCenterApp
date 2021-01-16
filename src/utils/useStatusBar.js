import React, { useCallback } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function useStatusBar(style, animated = true) {
    useFocusEffect(
      useCallback(() => {
        if(Platform.OS === 'ios') {
          StatusBar.setBarStyle(style, animated);
        } else {
          StatusBar.setBarStyle(style, animated);
        }
      }, [])
    );
}