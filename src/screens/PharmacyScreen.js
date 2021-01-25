import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import useStatusBar from '../utils/useStatusBar';
import auth from '@react-native-firebase/auth';
import FooterButton from '../components/FooterButton';
import FormButton from '../components/FormButton';

export default function PharmacyScreen({ navigation }) {
  useStatusBar('light-content');
  const [showForm, setShowForm] = useState(false);
  const [thread, setThread] = useState({});
  const [loading, setLoading] = useState(true);
  const user = {email: auth().currentUser.email, id: auth().currentUser.uid}

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
      .onSnapshot(querySnapshot => {
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
        <Card>
          <Card.Title
            title={thread.pharmacyName}
          />
          {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
          <Card.Content>
            <Title>Latest Message:</Title>
            <Paragraph>{thread.latestMessage.text}</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
        <View style={styles.footer}>
          <View style={styles.messages}>
            <FormButton
              title='Messages'
              modeValue='contained'
              labelStyle={styles.messagesButtonLabel}
              onPress={() => navigation.navigate('Messages', { thread } )}
            />
          </View>
          {showForm && (
          <FooterButton
              title='biweekly form'
              modeValue='contained'
              labelStyle={styles.formButton}
              onPress={() => navigation.navigate('Form')}
            />
            )}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
  messagesButtonLabel: {
    fontSize: 22,
  },
  about: {
    flex: 1,
    marginTop: 20,
  },
  messages: {
    marginBottom: 50,
  },
  footer: {
    alignItems: 'center',
  },
});