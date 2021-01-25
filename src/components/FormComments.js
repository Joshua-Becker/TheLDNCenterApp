import React from 'react';
import { StyleSheet, Dimensions, TextInput } from 'react-native';

const { width, height } = Dimensions.get('screen');

export default function FormComments({ labelName, ...rest }) {
    return (
      <TextInput
        placeholder={labelName}
        spellCheck={false}
        style={styles.input}
        numberOfLines={4}
        multiline={true}
        {...rest}
      />
    );
}

const styles = StyleSheet.create({
    input: {
        marginTop: 10,
        marginBottom: 10,
        width: width / 1.3,
        height: height / 4,
        backgroundColor: '#ddd',
        alignSelf: 'center',
    }
});