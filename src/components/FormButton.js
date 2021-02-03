import React from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
import { Button } from 'react-native-paper';

const { width, height } = Dimensions.get('screen');

export default function FormButton({ title, modeValue, ...rest }) {
  return (
    <Button
      mode={modeValue}
      style={styles.button}
      contentStyle={styles.buttonContainer}
      labelStyle={styles.buttonLabel}
      {...rest}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: '#D8752F',
    alignItems: 'center',
  },
  buttonContainer: {
    width: width / 2,
    height: height / 14
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 15,
  }
});