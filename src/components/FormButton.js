import React from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
import { Button } from 'react-native-paper';
import {useTheme} from '../navigation/ThemeProvider';

const { width, height } = Dimensions.get('screen');

export default function FormButton({ title, modeValue, ...rest }) {
  const {colors, isDark} = useTheme();
  return (
    <Button
      mode={modeValue}
      style={styles(colors).button}
      contentStyle={styles(colors).buttonContainer}
      labelStyle={styles(colors).buttonLabel}
      {...rest}
    >
      {title}
    </Button>
  );
}

const styles = (colors) => StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  buttonContainer: {
    width: width / 2,
    height: height / 14
  },
  buttonLabel: {
    color: colors.buttonText,
    fontSize: 15,
  }
});