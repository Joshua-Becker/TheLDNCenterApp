import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text} from 'react-native';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import useStatusBar from '../utils/useStatusBar';
import auth from '@react-native-firebase/auth';
import Notification from '../components/Notification';
import NavFooter from '../components/NavFooter';
import { AuthContext } from '../navigation/AuthProvider';
import { IconButton } from 'react-native-paper';
import {useTheme} from '../navigation/ThemeProvider';
import Graph from '../components/Graph';

const { width, height } = Dimensions.get('screen');

export default function TeamScreen({ navigation }) {
  const {colors, isDark} = useTheme();
  useStatusBar();
  const [showForm, setShowForm] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState({});
  const [graphLabels, setGraphLabels] = useState([]);
  const [thread, setThread] = useState({});
  const [loading, setLoading] = useState(true);
  const user = {email: auth().currentUser.email, id: auth().currentUser.uid}
  const { ethree, notifications, checkForNotifications } = useContext(AuthContext);

  function formatDate(date){
    return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
  }

  function allZeroes(items){
    if(items.length == 0){
      return true;
    }
    for(item of items){
      if(item != '0'){
        return false;
      }
    }
    return true;
  }

  async function showGraphCheck() {
    const forms = await firestore()
    .collection('USERS')
    .doc(user.id)
    .collection('FORMS')
    .orderBy('date', 'asc')
    .get().then((querySnapshot) => {
      let labelList = [];
      let graphDataTmp = {
        'anxiety': [],
        'depression': [],
        'fatigue': [],
        'memory': [],
        'headaches': [],
        'nausea': [],
        'constipation': [],
        'heartburn': [],
        'swelling': [],
        'insomnia': [],
        'pain': [],
        'neuropathy': [],
        'aches': [],
        'eczema': [],
        'rash': [],
        'drySkinHair': [],
        'acne': [],
        'brainFog': [],
        'irregularPeriods': [],
        'dizziness': [],
        'inflammation': [],
        'pmsSymptoms': [],
        'weightControl': [],
        'vividDreams': [],
      };
      let symptomKeys = [];
      if(querySnapshot.docs.length > 1){
        for(var i=0; i<querySnapshot.docs.length; i++){
          symptomKeys = Object.keys(querySnapshot.docs[i].data().symptoms);
          for(key of symptomKeys){
            graphDataTmp[key].push(querySnapshot.docs[i].data().symptoms[key]);
          }
          if(i == 0 || i == (querySnapshot.docs.length -1)){
            labelList.push(formatDate(new Date(querySnapshot.docs[i].data().date)));
          } else {
            labelList.push('');
          }
        }
        for(key of symptomKeys){
          if(allZeroes(graphDataTmp[key]) || graphDataTmp[key].length == 0){
            delete graphDataTmp[key];
          }
        }
        setGraphData(graphDataTmp);
        setGraphLabels([labelList]);
        setShowGraph(true); // Must come after setGraph methods to allow them to populate
        return;
      }
    });

  }

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
    showFormCheck();
    showGraphCheck();
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
          navigation.navigate('AddTeam');
        }
        let decryptedText;
        try {
          if(thread.latestMessage.text == null || thread.latestMessage.text == undefined || thread.latestMessage.text == '') {
            decryptedText = '';
          } else if(thread.latestMessage.id == thread.pharmacyID){
            let group;
            group = await ethree.getGroup(user.id);
            let findUserIdentity = await ethree.findUsers(user.id);
            if(group == null){
              group = await ethree.loadGroup(user.id, findUserIdentity);
            }
            findUserIdentity = await ethree.findUsers(thread.pharmacyID);
            decryptedText = await group.decrypt(thread.latestMessage.text, findUserIdentity);
          } else {
            const findUserIdentity = await ethree.findUsers(user.id);
            decryptedText = await group.decrypt(thread.latestMessage.text, findUserIdentity);
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
      <ScrollView style={styles(colors).scrollContainer} scrollIndicatorInsets={{ right: 1 }}>
        <View style={styles(colors).content}>
          <ScrollView style={styles(colors).about}>
            <Card style={styles(colors).card}>
              {/* <Card.Title
                title={thread.pharmacyName}
                titleStyle={styles(colors).cardTitle}
              /> */}
              <Card.Content>
              <Title style={styles(colors).cardSubTitle}>{thread.pharmacyName}</Title>
              <Title style={styles(colors).cardSubTitle}>{thread.providerName}</Title>
                <Divider style={styles(colors).divider}></Divider>
                <Title style={styles(colors).cardSubTitle}>Latest Message:</Title>
                <Paragraph style={styles(colors).cardText}>{thread.latestMessage.text}</Paragraph>
              </Card.Content>
            </Card>
          </ScrollView>
          <View style={styles(colors).messages}>
                <View style={styles(colors).notificationTitleContainer}>
                  <Text style={styles(colors).notificationTitleText}>Notifications</Text>
                </View>
                {Boolean(notifications.unreadMessageFromPharmacy) && (
                  <Notification
                  navigation={navigation}
                  text='New message'
                  link='Messages'
                  />
                )}
                {showForm &&
                <Notification
                navigation={navigation}
                text='Fill out biweekly form'
                link='Form'
              />
                }
          </View>
          {showGraph && 
            <View style={styles(colors).graphTitleContainer}>
              <Text style={styles(colors).graphTitleText}>Graphs</Text>
            </View>
          }
        </View>
        {showGraph &&
            Object.keys(graphData).map((key) => {
              //console.log(JSON.stringify(graphData))
              return(
                <View style={styles(colors).graph}>
                  <Graph
                    graphTitle={key}
                    graphData={graphData[key]}
                    graphLabels={graphLabels}
                  />
                </View>
              );
            }) 
        }
      </ScrollView>
      <View style={styles(colors).footer}>
            <NavFooter
            navigation={navigation}
            destA=''
            destB='Messages'
            destC='Form'
            iconA='account-details'
            iconB='message'
            iconC='folder-information'
            />
      </View>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContainer: {

  },
  content: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.backgroundShaded,
  },
  cardTitle: {
    color: colors.text,
  },
  cardSubTitle: {
    color: colors.text,
    fontSize: 18,
  },
  cardText: {
    color: colors.text,
  },
  about: {
    width: '100%',
  },
  messages: {
    marginTop: 15,
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
  },
  notificationContainer: {
    backgroundColor: colors.primary,
    width: width * 0.9,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center'
  },
  notificationIcon: {
    margin: 0,
  },
  notificationText: {
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  divider: {
    borderWidth: 1,
    borderColor: colors.text,
    marginTop: 5,
    marginBottom: 5,    
  },
  graph: {
    marginBottom: 20,
  },
  graphTitleContainer: {
    width: width * 0.9,
    borderBottomWidth: 1,
    borderColor: colors.text,
    padding: 15,
    marginTop: 20,
  },
  graphTitleText: {
    color: colors.text,
    fontSize: 20,
  },
});