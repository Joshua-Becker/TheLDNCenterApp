import React from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
import { Button } from 'react-native-paper';

const { width, height } = Dimensions.get('screen');

export default function FooterButton({ title, modeValue, ...rest }) {
  return (
    <Button
      mode={modeValue}
      {...rest}
      style={styles.button}
      labelStyle={styles.buttonLabel}
      contentStyle={styles.buttonContainer}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        backgroundColor: '#0C5FAA',
        borderRadius: 0,
        backgroundColor: '#CC5500',
    },
    buttonContainer: {
        height: height / 15,
        width: width,
    },
    buttonLabel: {
        fontSize: 22,    
    }
});