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
        margin: 10,
        height: height / 6,
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingRight: 10,
        paddingBottom: 20,
        paddingLeft: 10,
        color: '#000'
    }
});