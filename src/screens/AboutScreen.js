import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Card, Title, Paragraph, Divider} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import NavFooter from '../components/NavFooter';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';

export default function ResourcesScreen({navigation}) {
  const {user, checkForNotifications, ethree} = useContext(AuthContext);
  const currentUser = user.toJSON();
  let {colors, isDark} = useTheme();
  const [webData, setWebData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const identifiers = ['Email', 'Name', 'User ID', 'User Name'];
    const excludes = ['User ID', 'User Name'];
    const aboutListener = firestore()
      .collection('USERS')
      .doc(currentUser.uid)
      .onSnapshot(async (querySnapshot) => {
        let data = querySnapshot.data();
        if (data.cyj != undefined) {
          let cyj = [];
          for (obj of data.cyj) {
            if (excludes.includes(obj['name']) || obj['value'] == '') {
              continue;
            }
            if (identifiers.includes(obj['name'])) {
              let group;
              group = await ethree.getGroup(currentUser.uid);
              let findUserIdentity = await ethree.findUsers(currentUser.uid);
              if (group == null) {
                group = await ethree.loadGroup(
                  currentUser.uid,
                  findUserIdentity,
                );
              }
              obj['value'] = await group.decrypt(
                obj['value'],
                findUserIdentity,
              );
            }
            cyj.push(obj);
          }
          setWebData(cyj);
        }
        setLoading(false);
      });
    return () => aboutListener();
  }, []);

  return (
    <View style={styles(colors).container}>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles(colors).spinnerTextStyle}
        color={'white'}
      />
      <ScrollView
        style={styles(colors).scrollContainer}
        scrollIndicatorInsets={{right: 1}}>
        <View style={styles(colors).content}>
          <Card style={styles(colors).card}>
            <Card.Title title={'Me'} titleStyle={styles(colors).cardTitle} />
            <Divider style={styles(colors).divider}></Divider>
            {webData.map((name) => {
              return (
                <Card.Content key={name['name']}>
                  <Title style={styles(colors).cardSubTitle}>
                    {name['name']}
                  </Title>
                  <Paragraph style={styles(colors).cardText}>
                    {name['value']}
                  </Paragraph>
                </Card.Content>
              );
            })}
          </Card>
          <View style={styles(colors).stacks}>
            <View style={styles(colors).buttonContainer}>
              <FormButton
                title="Connect My Journey"
                modeValue="contained"
                onPress={() => navigation.push('GetCYJ')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <NavFooter
        navigation={navigation}
        destA=""
        destB="Resources"
        destC="MyResources"
        iconA="card-account-details"
        iconB="bookshelf"
        iconC="content-save"
      />
    </View>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: 'space-between',
    },
    content: {
      padding: 20,
      justifyContent: 'space-between',
    },
    buttonContainer: {
      marginTop: 20,
    },
    card: {
      width: '100%',
      backgroundColor: colors.backgroundShaded,
    },
    cardTitle: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 30,
    },
    cardSubTitle: {
      marginTop: 20,
      marginBottom: 5,
      color: colors.accent,
      fontSize: 18,
    },
    cardText: {
      color: colors.text,
    },
    divider: {
      borderWidth: 1,
      borderColor: colors.text,
      marginLeft: 15,
      marginRight: 15,
      marginBottom: 10,
    },
    spinnerTextStyle: {
      color: 'white',
    },
  });
