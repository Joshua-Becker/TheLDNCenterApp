import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { EThree } from '@virgilsecurity/e3kit-native';
import functions from '@react-native-firebase/functions';
import AsyncStorage from '@react-native-community/async-storage';

export const AuthContext = createContext({});


export const AuthProvider = ({ fcmToken, children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [ethree, setEthree] = useState(null);
  const getToken = functions().httpsCallable('getVirgilJwt');
  const initializeFunction = () => getToken().then(result => result.data.token);
  const delay = ms => new Promise(res => setTimeout(res, ms));

  function ethreeDerivedToStr(array) {
    let out = '';
    for (const num of array) {
      out += num.toString();
    }
    return out;
  }

  async function addNewUser(newUser, backupPassword, displayName, condition, painLevel, symptomTimeline, medications, comments) {
    const currentUser = newUser.toJSON();
    EThree.initialize(initializeFunction, { AsyncStorage }).then(async eThree => {
      await eThree.cleanup().then(() => console.log('ethree cleanup success'))
      .catch(e => console.error('ethree cleanup error: ', e));
      setEthree(eThree);
      await eThree.register()
        .then(async () => {
          const encryptedName = await eThree.authEncrypt(displayName);
          const encryptedEmail = await eThree.authEncrypt(currentUser.email);
          firestore()
            .collection('USERS')
            .doc(currentUser.uid)
            .set({
              user: {
                _id: currentUser.uid,
                email: encryptedEmail,
                name: encryptedName,
                condition: condition,
                painLevel: painLevel,
                symptomTimeline: symptomTimeline,
                medications: medications,
                comments: comments,
                token: fcmToken,
              },
              note: 'Saved Data',
          });
        })
        .catch(e => console.error('EThree Register Error: ', e));
      setEthree(eThree);
      await eThree.backupPrivateKey(backupPassword)
      .catch(e => console.error('EThree backup private key error: ', e));
    })
    .catch( err => {
      console.log('EThree register fail:' + err);
    });
  }

  function checkForNotifications(){
    firestore().collection('USERS').doc(user.uid).get()
    .then((doc) => {
      //console.log(doc.data());
      const data = doc.data();
      if(data.latestMessage != undefined && data.latestMessage.unreadMessageFromPharmacy != null && data.latestMessage.unreadMessageFromPharmacy != undefined){
        setNotifications({unreadMessageFromPharmacy: data.latestMessage.unreadMessageFromPharmacy});
      } else {
        setNotifications({unreadMessageFromPharmacy: false});
      }
    }).catch((error) => {
      setNotifications({unreadMessageFromPharmacy: false});
      console.log('Error getting user notifications: ' + error);
    });
  }

  // Alert put into a promise to be called asynchronously (Pause JS flow)
  const AsyncAlert = (title, msg) => new Promise((resolve) => {
    Alert.alert(
      title,
      msg,
      [
        {
          text: 'ok',
          onPress: () => {
            resolve('YES');
          },
        },
      ],
      { cancelable: false },
    );
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        ethree,
        notifications,
        setNotifications,
        checkForNotifications,
        login: async (email, password) => {
          let signedIn = false;
          try {
            let { loginPassword, backupPassword } = EThree.derivePasswords(password);
            loginPassword = ethreeDerivedToStr(loginPassword);
            backupPassword = ethreeDerivedToStr(backupPassword);
            await auth().signInWithEmailAndPassword(email, loginPassword)
            .then( async (userCreds) => {
              signedIn = true;
              setUser(userCreds.user);
              setEthree(await EThree.initialize(initializeFunction, { AsyncStorage }));
              const hasLocalPrivateKey = await eThree.hasLocalPrivateKey();
              if (!hasLocalPrivateKey) await eThree.restorePrivateKey(backupPassword);
            })
            .catch(async function(error) {
              console.log('Error occurred logging in' + error);
            });
          } catch (e) {
            console.log(e);
          }
          if(!signedIn){
            await AsyncAlert('Wrong username or password', 'Please try again');
          }
        },
        register: async (firstName, lastName, email, password, condition, painLevel, symptomTimeline, medications, comments) => {
          const username = firstName + ' ' + lastName;
          if(firstName == '' || lastName == '' || email == '' || password == '' || condition == '' || symptomTimeline == '') {
            alert("Please make sure the following fields are not empty: name, email, password, condition, symptom timeline");
            return;
          }
          try {
            console.log('Creating firebase user');
            let { loginPassword, backupPassword } = EThree.derivePasswords(password);
            loginPassword = ethreeDerivedToStr(loginPassword);
            backupPassword = ethreeDerivedToStr(backupPassword);
            await auth().createUserWithEmailAndPassword(email, loginPassword).then(function(user) {
              var user = auth().currentUser;
              user.updateProfile({
                  displayName: username
              }).then( async function() {
                  setUser(user);
                  addNewUser(user, backupPassword, username, condition, painLevel, symptomTimeline, medications, comments);
              }, function(error) {
                console.error("Error adding new user" + error);
                  // An error happened.
              }).catch( function(error) {
                console.log("Error adding new user (catch): " + error);
              });        
          }, function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // [START_EXCLUDE]
              if (errorCode == 'auth/weak-password') {
                  alert('The password is too weak.');
              } else {
                  console.error(error);
              }
              // [END_EXCLUDE]
          });
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try{
            if(typeof eThree !== 'undefined') await eThree.cleanup();
          } catch (e) {
            console.error('Error removing private key:' + e);
          }
          try {
            await auth().signOut();
          } catch (e) {
            console.error('Error signing out:' + e);
          }
        },
        submitForm: async (painLevel, sideEffects, comments) => {
          var user = auth().currentUser
          firestore()
          .collection('USERS')
          .doc(user.uid)
          .collection('FORMS')
          .add({
            pain: painLevel,
            sideEffects: sideEffects,
            comments: comments,
            date: new Date().getTime(),
          });
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

  