import React from 'react';
import { StyleSheet, Dimensions, TextInput } from 'react-native';
//import { TextInput } from 'react-native-paper';

const { width, height } = Dimensions.get('screen');

export default function FormInput({ labelName, ...rest }) {
    return (
      <TextInput
        placeholder={labelName}
        spellCheck={false}
        style={styles.input}
        numberOfLines={1}
        {...rest}
      />
    );
}

const styles = StyleSheet.create({
    input: {
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10,
      width: width / 1.3,
      height: height / 15,
      backgroundColor: '#ddd',
      borderRadius: 5,
    }
});