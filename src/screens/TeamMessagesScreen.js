import React, { useState, useContext, useEffect } from 'react';
import { GiftedChat, Bubble, Send, SystemMessage, InputToolbar } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { ActivityIndicator, View, StyleSheet, LogBox, Text } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import useStatusBar from '../utils/useStatusBar';
import {useTheme} from '../navigation/ThemeProvider';
import NavFooter from '../components/NavFooter';

// Disable to see warnings
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default function TeamMessagesScreen({navigation}) {
  const {colors, isDark} = useTheme();
  useStatusBar();
  const { user, checkForNotifications } = useContext(AuthContext);
  const currentUser = user.toJSON();
  const [userData, setUserData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const { ethree, auditLog } = useContext(AuthContext);

  async function getUserData(){
    await firestore()
      .collection('USERS')
      .doc(currentUser.uid)
      .get()
      .then((snapshot) => {
        const data = snapshot.data()
        setUserData(data);
        setDataLoaded(true);
      });
  }

  function renderSystemMessage(props) {
      return (
        <SystemMessage
          {...props}
          wrapperStyle={styles(colors).systemMessageWrapper}
          textStyle={styles(colors).systemMessageText}
        />
      );
  }

  function renderLoading() {
      return (
          <View style={styles(colors).loadingContainer}>
          <ActivityIndicator size='large' color='#0C5FAA' />
          </View>
      );
  }

  function renderSend(props) {
      return (
          <Send {...props}>
          <View style={styles(colors).sendingContainer}>
              <IconButton icon='send-circle' size={40} color='#0C5FAA' />
          </View>
          </Send>
      );
  }

  function renderInputToolbar(props){
    return(
      <View style={styles(colors).inputToolbarContainer}>
        <InputToolbar containerStyle={styles(colors).inputToolbar} {...props} />
      </View>
    );
  }

  function renderBubble(props) {
      return (
          // Step 3: return the component
          <View>
            {/* {props.position === 'left' ? <Text style={styles(colors).messageSender}>{props.currentMessage.user.type}</Text> : <Text></Text>} */}
            <Bubble
            {...props}
            wrapperStyle={{
              right: {
              // Here is the color change
                backgroundColor: '#0C5FAA',
              },
              left: {
                // Here is the color change
                backgroundColor: '#171921',
              },
            }}
            textStyle={{
              right: {
                color: '#fff',
              },
              left: {
                color: '#fff',
              },
            }}
            textProps={{
              style: {
                color: props.position === 'left' ? '#fff' : '#fff',
              },
            }}
            />
        </View>
      );
  }

  function scrollToBottomComponent() {
      return (
          <View style={styles(colors).bottomComponentContainer}>
          <IconButton icon='chevron-double-down' size={36} color={colors.primary} />
          </View>
      );
  }

  function setPharmacyUnreadMessageToTrue(){
    firestore().collection('CAREGIVERS').doc(userData.pharmacyID).collection('PATIENTS').doc(userData.user._id)
    .set({
      unreadMessage: true,
    }, { merge: true });
    firestore().collection('CAREGIVERS').doc(userData.providerID).collection('PATIENTS').doc(userData.user._id)
    .set({
      unreadMessage: true,
    }, { merge: true });
  }

  function setPatientUnreadMessageToFalse(){
    console.log('Setting unreadMessage to false');
    checkForNotifications();
    firestore().collection('USERS').doc(userData.user._id)
    .set({
      latestMessage: {
        unreadMessage: false,
      }
    }, { merge: true });
  }

  // helper method that is sends a message
  async function handleSend(messages) {
    setPharmacyUnreadMessageToTrue();
    const text = messages[0].text;
    let group;
    group = await ethree.getGroup(userData.user._id);
    const findUserIdentity = await ethree.findUsers(userData.user._id);
    if(group == null){
      group = await ethree.loadGroup(userData.user._id, findUserIdentity);
    }
    const encryptedMessage = await group.encrypt(text);

    firestore()
      .collection('USERS')
      .doc(userData.user._id)
      .collection('MESSAGES')
      .add({
        text: encryptedMessage,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          type: 'patient',
          // email: currentUser.email
        }
      });

    await firestore()
      .collection('USERS')
      .doc(userData.user._id)
      .set(
        {
          latestMessage: {
            id: userData.user._id,
            text: encryptedMessage,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      );
    
    auditLog(user.id, 'Sent message');
  }

  function renderAvatar(props){
    console.log(props.currentMessage.user.type);
    const userType = props.currentMessage.user.type;
    let iconName = '';
    if(userType === 'pharmacy'){
      iconName = 'pill';
    } else{
      iconName = 'stethoscope';
    }
    return (
      <View style={styles(colors).avatarContainer}>
        <IconButton style={styles(colors).avatarIcon} icon={iconName} size={36} color={colors.text} />
      </View>
  );
  }

  useEffect(() => {
    getUserData();
    if(Object.keys(userData).length !== 0){
      const messagesListener = firestore()
      .collection('USERS')
      .doc(userData.user._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const newMessages = querySnapshot.docs.map( async (doc) => {
          const firebaseData = doc.data();
          let decryptedText;
          let group = await ethree.getGroup(userData.user._id);
          const findUserIdentity = await ethree.findUsers(userData.user._id);
          if(group == null){
            group = await ethree.loadGroup(userData.user._id, findUserIdentity);
          }
          if(firebaseData.user._id == userData.pharmacyID){
            const findUserIdentity = await ethree.findUsers(userData.pharmacyID);
            decryptedText = await group.decrypt(firebaseData.text, findUserIdentity);
          } 
          else if(firebaseData.user._id == userData.providerID){
            const findUserIdentity = await ethree.findUsers(userData.providerID);
            decryptedText = await group.decrypt(firebaseData.text, findUserIdentity);
          }
           else {
            const findUserIdentity = await ethree.findUsers(userData.user._id);
            decryptedText = await group.decrypt(firebaseData.text, findUserIdentity);
          }
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };
          data.text = decryptedText;
          return data;
        })
        Promise.all(newMessages).then(function(results) {
          setMessages(results);
          setPatientUnreadMessageToFalse();
        }).catch(error => console.log('Error returning messages: ' + error));
      });
      // Stop listening for updates whenever the component unmounts
      return () => messagesListener();
    }
  }, [dataLoaded]);

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).giftedChatContainer}>
        <GiftedChat
            messages={messages}
            onSend={handleSend}
            user={{ _id: currentUser.uid}}
            renderBubble={renderBubble}
            placeholder='Type your message here...'
            // showUserAvatar
            alwaysShowSend
            // renderAvatar={() => null}
            renderAvatar={renderAvatar}
            renderSend={renderSend}
            scrollToBottomComponent={scrollToBottomComponent}
            renderLoading={renderLoading}
            renderSystemMessage={renderSystemMessage}
            renderInputToolbar={renderInputToolbar}
        />
      </View>
        <NavFooter
            navigation={navigation}
            destA='TeamHome'
            destB=''
            destC='Form'
            iconA='account-details'
            iconB='message'
            iconC='folder-information'
        />
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  avatarIcon: {
    margin: 0,
    bottom: 3,
  },
  messageSender : {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  giftedChatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  systemMessageWrapper: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
  },
  inputToolbarContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  inputToolbar: {
    borderRadius: 10,
    backgroundColor: '#ccc',
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 4,
  }
});