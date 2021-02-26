import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import useStatusBar from '../utils/useStatusBar';
import auth from '@react-native-firebase/auth';
import FooterButton from '../components/FooterButton';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import { IconButton } from 'react-native-paper';
import {useTheme} from '../navigation/ThemeProvider';

const { width, height } = Dimensions.get('screen');

export default function PharmacyScreen({ navigation }) {
  const {colors, isDark} = useTheme();
  useStatusBar();
  const [showForm, setShowForm] = useState(false);
  const [thread, setThread] = useState({});
  const [loading, setLoading] = useState(true);
  const user = {email: auth().currentUser.email, id: auth().currentUser.uid}
  const { ethree, notifications, checkForNotifications } = useContext(AuthContext);

  async function showFormCheck() {
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
    // Check if 2 weeks have elapsed since the last form entry in milliseconds
    if(timeSinceLastEntry > 1209600000) {
      setShowForm(true)
      //console.log('TEST TRUE:' + timeSinceLastEntry )
    } else {
      setShowForm(false)
      //console.log('TEST FALSE:' + timeSinceLastEntry)
    }
  }
  /**
   * Fetch threads from Firestore
   */
  useEffect(() => {
    checkForNotifications();
    showFormCheck()
    const unsubscribe = firestore()
      .collection('USERS')
      .doc(user.id)
      .onSnapshot(async querySnapshot => {
        const data = querySnapshot.data();
        const thread = {
          _id: querySnapshot.id,
          name: '',
          latestMessage: {
            text: ''
          },
          ...data
        };
        if(thread.pharmacyName == '' || thread.pharmacyName == undefined){
          navigation.navigate('AddPharmacy');
        }
        let decryptedText;
        try {
          if(thread.latestMessage.text == null || thread.latestMessage.text == undefined || thread.latestMessage.text == '') {
            decryptedText = '';
          } else if(thread.latestMessage.id == thread.pharmacyID){
            const findUserIdentity = await ethree.findUsers(thread.pharmacyID);
            decryptedText = await ethree.authDecrypt(thread.latestMessage.text, findUserIdentity);
          } else {
            decryptedText = await ethree.authDecrypt(thread.latestMessage.text);
          }
        }
        catch(err){
          console.log("Error decrypting latest message: " + err);
          decryptedText = '';
        }
        thread.latestMessage.text = decryptedText;
        setThread(thread);
        if (loading) {
          setLoading(false);
        }
      });
    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).content}>
        <ScrollView style={styles(colors).about}>
          <Card style={styles(colors).card}>
            <Card.Title
              title={thread.pharmacyName}
              titleStyle={styles(colors).cardTitle}
            />
            <Divider style={styles(colors).divider}></Divider>
            <Card.Content>
              <Title style={styles(colors).cardSubTitle}>Latest Message:</Title>
              <Paragraph style={styles(colors).cardText}>{thread.latestMessage.text}</Paragraph>
            </Card.Content>
          </Card>
        </ScrollView>
        <View style={styles(colors).messages}>
              <FormButton
                title='Go To Messages'
                modeValue='contained'
                onPress={() => navigation.navigate('Messages', { thread } )}
              />
              {Boolean(notifications.unreadMessageFromPharmacy) && (
              <IconButton style={styles(colors).notificationIcon} icon='alert-circle' color='white' size={40}/>
              )}
          </View>
      </View>
      <View style={styles(colors).footer}>
        {showForm && (
        <FooterButton
            title='biweekly form'
            subTitle={thread.pharmacyName + ' is requesting an update to help you reach your best LDN dose'}
            onPress={() => navigation.navigate('Form')}
          />
          )}
      </View>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#2F3243',
  },
  cardTitle: {
    color: '#fff',
  },
  cardSubTitle: {
    color: '#fff',
    fontSize: 18,
  },
  cardText: {
    color: '#ccc',
  },
  about: {
    width: '100%',
  },
  messages: {
    marginTop: 15,
  },
  notificationIcon: {
    position: 'absolute',
    right: -width / 15,
    top: -width / 30,
    backgroundColor: '#3F4252',
    margin: 0,
    width: 50,
    height: 50,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    borderWidth: 1,
    borderColor: '#bbb',
    marginLeft: 15,
    marginRight: 15,    
  },
});