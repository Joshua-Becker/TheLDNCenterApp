import React from 'react';
import { StyleSheet, Dimensions, TextInput } from 'react-native';
import {useTheme} from '../navigation/ThemeProvider';

const { width, height } = Dimensions.get('screen');

export default function FormInput({ labelName, ...rest }) {
  const {colors, isDark} = useTheme();
  return (
    <TextInput
      placeholder={labelName}
      placeholderTextColor={colors.formText}
      spellCheck={false}
      style={styles(colors).input}
      numberOfLines={1}
      {...rest}
    />
  );
}

const styles = (colors) => StyleSheet.create({
    input: {
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10,
      width: width / 1.3,
      height: height / 15,
      backgroundColor: colors.formBackground,
      borderRadius: 5,
      padding: 10,
    }
});