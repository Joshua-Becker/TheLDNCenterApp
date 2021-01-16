import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import useStatusBar from '../utils/useStatusBar';
import auth from '@react-native-firebase/auth';
import FooterButton from '../components/FooterButton';

export default function PharmacyScreen({ navigation }) {
  useStatusBar('light-content');
  const [showForm, setShowForm] = useState(false);
  const [threads, setThreads] = useState([]);
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
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: {
              text: ''
            },
            ...documentSnapshot.data()
          };
        });
        const filteredThreads = threads.filter(thread => thread._id == user.id);
        setThreads(filteredThreads);
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
      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Room', { thread: item })}
          >
            <List.Item
              title={item.pharmacyName}
              description={item.latestMessage.text}
              titleNumberOfLines={1}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              descriptionNumberOfLines={1}
            />
          </TouchableOpacity>
        )}
      />
      {showForm && (
        <View style={styles.formButton}>
          <FooterButton
              title='biweekly form'
              modeValue='contained'
              labelStyle={styles.formButton}
              onPress={() => navigation.navigate('Form')}
            />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
});