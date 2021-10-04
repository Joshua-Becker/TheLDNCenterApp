import React, { useState, useContext, useEffect, useReducer } from 'react';
import { ScrollView, View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import FormButton from '../components/FormButton';
import Notification from '../components/Notification';
import { AuthContext } from '../navigation/AuthProvider';
import useStatusBar from '../utils/useStatusBar';
import {useTheme} from '../navigation/ThemeProvider';
import { Card, Title, Paragraph, Divider, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import PushNotification from "react-native-push-notification";

const { width, height } = Dimensions.get('screen');

export default function HomeScreen({ navigation }) {
    useStatusBar();
    const {colors, isDark} = useTheme();

    const { notifications, checkForNotifications } = useContext(AuthContext);
    const [showForm, setShowForm] = useState(false);
    const [showMessageNotification, setShowMessageNotification] = useState(false);
    const [latestMessage, setLatestMessage] = useState({});
    const [latestMessagePharmacy, setLatestMessagePharmacy] = useState({});
    const [latestMessageProvider, setLatestMessageProvider] = useState({});
    const [pharmacyName, setPharmacyName] = useState('');
    const [providerName, setProviderName] = useState('');
    const user = {email: auth().currentUser.email, id: auth().currentUser.uid}

  async function getLatestmessage(userInfo){
    firestore()
    .collection('ANNOUNCEMENTS').orderBy('date', 'asc').get().then( query => {
      query.forEach(doc => {
        if(Object.keys(latestMessage).length == 0 && (doc.data().type == 'general' || doc.data().type == userInfo.condition) && doc.data().for == 'patient') {
          setLatestMessage(doc.data());
        }
      })
    });
    if(userInfo.pharmacyID != undefined && userInfo.pharmacyID != ''){
      setPharmacyName(userInfo.pharmacyName);
      firestore()
      .collection('CAREGIVERS').doc(userInfo.pharmacyID).collection('ANNOUNCEMENTS').orderBy('date', 'asc').get().then( query => {
        if(query != null){
          query.forEach(doc => {
            if(Object.keys(latestMessagePharmacy).length == 0) {
              setLatestMessagePharmacy(doc.data());
            }
          })
        }
      });
    }
    if(userInfo.providerID != undefined && userInfo.providerID != ''){
      setProviderName(userInfo.providerName);
      firestore()
      .collection('CAREGIVERS').doc(userInfo.providerID).collection('ANNOUNCEMENTS').orderBy('date', 'asc').get().then( query => {
        if(query != null){
          query.forEach(doc => {
            if(Object.keys(latestMessageProvider).length == 0) {
              setLatestMessageProvider(doc.data());
            }
          })
        }
      });
    }
  }

  async function showFormCheck(formInterval) {
    const latestForm = await firestore()
    .collection('USERS')
    .doc(user.id)
    .collection('FORMS')
    .orderBy('date', 'desc')
    .limit(1)
    .get();
    const dateNow = new Date().getTime()
    if(latestForm.docs.length == 0){
      setShowForm(true)
      return
    }
    const latestFormDate = (latestForm.docs[0].data()).date
    const timeSinceLastEntry = dateNow - latestFormDate
    const dayInMS = 86400000;
    const formIntervalMs = formInterval * dayInMS;
    // Check if 2 weeks have elapsed since the last form entry in milliseconds
    if(timeSinceLastEntry > formInterval) {
      setShowForm(true)
      //console.log('TEST TRUE:' + timeSinceLastEntry )
    } else {
      setShowForm(false)
      //console.log('TEST FALSE:' + timeSinceLastEntry)
    }
  }

  async function setup(){
    let thread = {};
    await firestore()
    .collection('USERS')
    .doc(user.id)
    .get().then(async querySnapshot => {
      const data = querySnapshot.data();
      thread = {
        _id: querySnapshot.id,
        name: '',
        latestMessage: {
          text: ''
        },
        ...data
      };
      showFormCheck(thread.formInterval);
    });
    checkForNotifications(); 
    if(notifications == null){
      setShowMessageNotification(false);
    } else if (notifications.unreadMessage == true){
      setShowMessageNotification(true);
    }
    if(Object.keys(latestMessage).length == 0 ) {
      getLatestmessage(thread);
    }
  }

  function handleNotification(){
    PushNotification.localNotification({
      channelId: 'login-channel',
      title: 'Health Center',
      message: 'Fill out form reminder',
    });
  }

  useEffect(() => {
    setup();
    if(showForm){
      handleNotification();
    }
  }, [latestMessage, showForm]);

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).content}>
        <Image 
            source={isDark? require('../media/images/logo-light.png') : require('../media/images/logo-dark.png')} 
            style={styles(colors).logo}
        />
        <View style={styles(colors).stacks}>
          <View style={styles(colors).buttonContainer}>
            <FormButton
              title='My Healthcare Team'
              modeValue='contained'
              onPress={() => navigation.push('Team')}
            />
          </View>
          <View style={styles(colors).buttonContainer}>
            <FormButton
              title='My Resources'
              modeValue='contained'
              onPress={() => navigation.push('Resources')}
            />
          </View>
        </View>
        <View style={styles(colors).notifications}>
        <View style={styles(colors).notificationTitleContainer}>
          <Text style={styles(colors).notificationTitleText}>Notifications</Text>
        </View>
        {Boolean(showMessageNotification) && (
          <Notification
            navigation={navigation}
            text='My Healthcare Team - Message'
            link='Team'
          />
        )}
        {showForm &&
          <Notification
          navigation={navigation}
          text='Fill out form'
          link='Form'
          />
        }
        </View>
        <ScrollView style={styles(colors).newsScroll} persistentScrollbar={true} showsVerticalScrollIndicator={true}>
        { Boolean(Object.keys(latestMessage).length > 0) && (
          <View>
            <View style={styles(colors).notificationTitleContainer}>
              <Text style={styles(colors).notificationTitleText}>Announcements</Text>
            </View>
            <Card style={styles(colors).card}>
              <Card.Content>
                <Title style={styles(colors).cardSubTitle}>{latestMessage.title}</Title>
                <Paragraph style={styles(colors).cardText}>The LDN Health Center</Paragraph>
                <Divider style={styles(colors).divider}></Divider>
                <Paragraph style={styles(colors).cardText}>{latestMessage.content}</Paragraph>
                <Button style={styles(colors).cardView} onPress={() => Linking.openURL(latestMessage.link)}>View</Button>
              </Card.Content>
            </Card>
          </View>
        )}
        { Boolean(Object.keys(latestMessagePharmacy).length > 0) && (
            <Card style={styles(colors).card}>
              <Card.Content>
                <Title style={styles(colors).cardSubTitle}>{latestMessagePharmacy.title}</Title>
                <Paragraph style={styles(colors).cardText}>{pharmacyName}</Paragraph>
                <Divider style={styles(colors).divider}></Divider>
                <Paragraph style={styles(colors).cardText}>{latestMessagePharmacy.content}</Paragraph>
                <Button style={styles(colors).cardView} onPress={() => Linking.openURL(latestMessagePharmacy.link)}>View</Button>
              </Card.Content>
            </Card>
        )}
        { Boolean(Object.keys(latestMessageProvider).length > 0) && (
            <Card style={styles(colors).card}>
              <Card.Content>
                <Title style={styles(colors).cardSubTitle}>{latestMessageProvider.title}</Title>
                <Paragraph style={styles(colors).cardText}>{providerName}</Paragraph>
                <Divider style={styles(colors).divider}></Divider>
                <Paragraph style={styles(colors).cardText}>{latestMessageProvider.content}</Paragraph>
                <Button style={styles(colors).cardView} onPress={() => Linking.openURL(latestMessageProvider.link)}>View</Button>
              </Card.Content>
            </Card>
        )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: 20,
    // paddingBottom: height / 9,
    width: '100%',
    justifyContent: 'space-between',
    flex: 1,
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10
  },
  logo: {
    width: width / 3,
    height: width / 6,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  notificationTitleContainer: {
    width: width * 0.9,
    borderBottomWidth: 1,
    borderColor: colors.text,
    padding: 15,
    marginBottom: 10,
  },
  notificationTitleText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  newsScroll: {
    flex: 1,
  },
  card: {
    width: '100%',
    backgroundColor: colors.backgroundShaded,
    marginBottom: 10,
  },
  cardTitle: {
    color: colors.text,
  },
  cardSubTitle: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    color: colors.text,
  },
  cardView: {
    alignSelf: 'flex-end',
  },
  divider: {
    borderWidth: 1,
    borderColor: colors.text,
    marginTop: 5,
    marginBottom: 5,    
  },
  stacks: {
    marginBottom: 20,
  }
});