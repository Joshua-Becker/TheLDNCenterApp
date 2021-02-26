import React from 'react';
import { StyleSheet, Dimensions, TextInput } from 'react-native';
import {useTheme} from '../navigation/ThemeProvider';

const { width, height } = Dimensions.get('screen');

export default function FormComments({ labelName, ...rest }) {
  const {colors, isDark} = useTheme();

  return (
    <TextInput
      placeholder={labelName}
      placeholderTextColor={colors.formText}
      spellCheck={false}
      style={styles(colors).input}
      numberOfLines={4}
      multiline={true}
      {...rest}
    />
  );
}

const styles = (colors) => StyleSheet.create({
    input: {
        margin: 10,
        height: height / 6,
        borderRadius: 5,
        backgroundColor: colors.formBackground,
        paddingTop: 20,
        paddingRight: 10,
        paddingBottom: 20,
        paddingLeft: 10,
        color: colors.formText,
    }
});