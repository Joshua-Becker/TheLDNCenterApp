import React from 'react';
import { StyleSheet, Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';


const { width, height } = Dimensions.get('screen');

export default function FooterButton({ title, subTitle, ...rest }) {
  return (
    <TouchableOpacity
      style={styles.footerButton}
      {...rest}
    >
      <View style={styles.buttonTitleContainer}>
        <Text style={styles.buttonTitle}>{title}</Text>
        <IconButton
          icon='arrow-right'
          size={20}
          color='#fff'
        />
      </View>
      <Text style={styles.buttonSubTitle}>{subTitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  footerButton: {
    marginTop: 10,
    backgroundColor: '#1E6EB4',
    borderRadius: 0,
    flexDirection: 'column',
    width: width,
    padding: 10,
    paddingBottom: 20,
    alignItems:'center',
  },
  buttonTitle: {
    fontSize: 22,
    color: '#fff',
    textTransform: 'uppercase'
  },
  buttonSubTitle: {
    fontSize: 12,
    color: '#fff',
    maxWidth: '75%',
  },
  buttonTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});