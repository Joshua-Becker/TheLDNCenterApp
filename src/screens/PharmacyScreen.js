import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import useStatusBar from '../utils/useStatusBar';
import auth from '@react-native-firebase/auth';
import FooterButton from '../components/FooterButton';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';

export default function PharmacyScreen({ navigation }) {
  useStatusBar('light-content');
  const [showForm, setShowForm] = useState(false);
  const [thread, setThread] = useState({});
  const [loading, setLoading] = useState(true);
  const user = {email: auth().currentUser.email, id: auth().currentUser.uid}
  const { ethree } = useContext(AuthContext);

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
    showFormCheck()
    const unsubscribe = firestore()
      .collection('USERS')
      .doc(user.id)
      .onSnapshot(async querySnapshot => {
        const thread = {
          _id: querySnapshot.id,
          name: '',
          latestMessage: {
            text: ''
          },
          ...querySnapshot.data()
        };
        if(thread.pharmacyName == '' || thread.pharmacyName == undefined){
          navigation.navigate('AddPharmacy');
        }
        let decryptedText;
        try {
          console.log(querySnapshot.id + ' : ' + thread.pharmacyID);
          if(querySnapshot.id == thread.pharmacyID){
            console.log('Option1')
            const findUserIdentity = await ethree.findUsers(thread.pharmacyID);
            decryptedText = await ethree.authDecrypt(thread.latestMessage.text, findUserIdentity);
          } else if(thread.latestMessage.text == null || thread.latestMessage.text == undefined) {
            console.log('Option2')
            decryptedText = '';
          } else {
            console.log('Option3')
            decryptedText = await ethree.authDecrypt(thread.latestMessage.text);
            console.log('Option3: ' +  decryptedText)
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
    <View style={styles.container}>
      <ScrollView style={styles.about}>
        <Card style={styles.card}>
          <Card.Title
            title={thread.pharmacyName}
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Title style={styles.cardSubTitle}>Latest Message:</Title>
            <Paragraph style={styles.cardText}>{thread.latestMessage.text}</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
        <View style={styles.footer}>
          <View style={styles.messages}>
            <FormButton
              title='Messages'
              modeValue='contained'
              onPress={() => navigation.navigate('Messages', { thread } )}
            />
          </View>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3F4253',
    flex: 1,
    justifyContent: 'space-between',
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
  },
  cardText: {
    color: '#fff',
  },
  about: {
    flex: 1,
    marginTop: 20,
    width: '90%',
  },
  messages: {
    marginBottom: 50, 
    width: '50%',   
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
});