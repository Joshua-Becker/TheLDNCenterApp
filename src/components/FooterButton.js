import React from 'react';
import { StyleSheet, Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import {useTheme} from '../navigation/ThemeProvider';

const { width, height } = Dimensions.get('screen');

export default function FooterButton({ title, subTitle, ...rest }) {
  const {colors, isDark} = useTheme();
  return (
    <TouchableOpacity
      style={styles(colors).footerButton}
      {...rest}
    >
      <View style={styles(colors).buttonTitleContainer}>
        <Text style={styles(colors).buttonTitle}>{title}</Text>
        <IconButton
          icon='arrow-right'
          size={20}
          color={colors.footerButtonText}
        />
      </View>
      <Text style={styles(colors).buttonSubTitle}>{subTitle}</Text>
    </TouchableOpacity>
  );
}

const styles = (colors) => StyleSheet.create({
  footerButton: {
    backgroundColor: colors.footerButtonBackground,
    borderRadius: 5,
    flexDirection: 'column',
    width: width * 0.9,
    padding: 10,
    alignItems:'center',
  },
  buttonTitle: {
    fontSize: 22,
    color: colors.footerButtonText,
    textTransform: 'uppercase'
  },
  buttonSubTitle: {
    fontSize: 12,
    color: colors.footerButtonText,
    maxWidth: '75%',
  },
  buttonTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});