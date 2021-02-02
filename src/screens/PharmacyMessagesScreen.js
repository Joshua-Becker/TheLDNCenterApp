import React, { useState, useContext, useEffect } from 'react';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import useStatusBar from '../utils/useStatusBar';


export default function PharmacyMessagesScreen({ route }) {
    useStatusBar('light-content');
    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const { thread } = route.params;
    const [messages, setMessages] = useState([]);
    const { ethree } = useContext(AuthContext);

    function renderSystemMessage(props) {
        return (
          <SystemMessage
            {...props}
            wrapperStyle={styles.systemMessageWrapper}
            textStyle={styles.systemMessageText}
          />
        );
    }

    function renderLoading() {
        return (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#0C5FAA' />
            </View>
        );
    }

    function renderSend(props) {
        return (
            <Send {...props}>
            <View style={styles.sendingContainer}>
                <IconButton icon='send-circle' size={32} color='#0C5FAA' />
            </View>
            </Send>
        );
    }

    function renderBubble(props) {
        return (
            // Step 3: return the component
            <Bubble
            {...props}
            wrapperStyle={{
              right: {
              // Here is the color change
                backgroundColor: '#0C5FAA'
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
        );
    }

    function scrollToBottomComponent() {
        return (
            <View style={styles.bottomComponentContainer}>
            <IconButton icon='chevron-double-down' size={36} color='#0C5FAA' />
            </View>
        );
    }

    // helper method that is sends a message
    async function handleSend(messages) {
        const text = messages[0].text;
        const findUserIdentity = await ethree.findUsers(thread.pharmacyID);
        const encryptedMessage = await ethree.authEncrypt(text, findUserIdentity);
        firestore()
          .collection('USERS')
          .doc(thread._id)
          .collection('MESSAGES')
          .add({
            text: encryptedMessage,
            createdAt: new Date().getTime(),
            user: {
              _id: currentUser.uid,
              email: currentUser.email
            }
          });
    
        await firestore()
          .collection('USERS')
          .doc(thread._id)
          .set(
            {
              latestMessage: {
                text: encryptedMessage,
                createdAt: new Date().getTime()
              }
            },
            { merge: true }
          );
    }

    useEffect(() => {     
      const messagesListener = firestore()
        .collection('USERS')
        .doc(thread._id)
        .collection('MESSAGES')
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          const newMessages = querySnapshot.docs.map( async (doc) => {
            const firebaseData = doc.data();
            let decryptedText;
            if(firebaseData.user._id == thread.pharmacyID){
              const findUserIdentity = await ethree.findUsers(thread.pharmacyID);
              decryptedText = await ethree.authDecrypt(firebaseData.text, findUserIdentity);
            } else {
              decryptedText = await ethree.authDecrypt(firebaseData.text);
            }
            const data = {
              _id: doc.id,
              text: '',
              createdAt: new Date().getTime(),
              ...firebaseData
            };
            if (!firebaseData.system) {
              data.user = {
                ...firebaseData.user,
                name: firebaseData.user.email
              };
            }
            data.text = decryptedText;
            return data;
          })
          Promise.all(newMessages).then(function(results) {
            setMessages(results);
          }).catch(error => console.log('Error returning messages: ' + error));
        });
  
      // Stop listening for updates whenever the component unmounts
      return () => messagesListener();
    }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={handleSend}
            user={{ _id: currentUser.uid }}
            renderBubble={renderBubble}
            placeholder='Type your message here...'
            showUserAvatar
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottomComponent={scrollToBottomComponent}
            renderLoading={renderLoading}
            renderSystemMessage={renderSystemMessage}
        />
    );
}

const styles = StyleSheet.create({
    sendingContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    bottomComponentContainer: {
      justifyContent: 'center',
      alignItems: 'center' 
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
});