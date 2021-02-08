import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { EThree } from '@virgilsecurity/e3kit-native';
import functions from '@react-native-firebase/functions';
import AsyncStorage from '@react-native-community/async-storage';

export const AuthContext = createContext({});


export const AuthProvider = ({ fcmToken, children }) => {
  const [user, setUser] = useState(null);
  const [ethree, setEthree] = useState(null);
  const getToken = functions().httpsCallable('getVirgilJwt');
  const initializeFunction = () => getToken().then(result => result.data.token);
  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function addNewUser(newUser, condition, painLevel, symptomTimeline, medications, comments) {
    const currentUser = newUser.toJSON();
    EThree.initialize(initializeFunction, { AsyncStorage }).then(async eThree => {
      await eThree.cleanup();
      await eThree.register()
        .then(async () => {
          // console.log('EThree Register Success: ' + currentUser.displayName + ' : ' + currentUser.email);
          const encryptedName = await ethree.authEncrypt(currentUser.displayName);
          const encryptedEmail = await ethree.authEncrypt(currentUser.email);
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
    })
    .catch( err => {
      console.log('EThree register fail:' + err);
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        ethree,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
          setEthree(await EThree.initialize(initializeFunction, { AsyncStorage }));
        },
        register: async (firstName, lastName, email, password, condition, painLevel, symptomTimeline, medications, comments) => {
          console.log('Beginning Register');
          const username = firstName + ' ' + lastName;
          if(firstName == '' || lastName == '' || email == '' || password == '' || condition == '' || symptomTimeline == '') {
            alert("Please make sure the following fields are not empty: name, email, password, condition, symptom timeline");
            return;
          }
          try {
            console.log('Creating firebase user');
            await auth().createUserWithEmailAndPassword(email, password).then(function(user) {
              var user = auth().currentUser;
              user.updateProfile({
                  displayName: username
              }).then( async function() {
                  const newUser = auth().currentUser;
                  await delay(2000)
                  addNewUser(newUser, condition, painLevel, symptomTimeline, medications, comments);
              }, function(error) {
                console.error("Error adding new user" + error);
                  // An error happened.
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
          try {
            await auth().signOut();
          } catch (e) {
            console.error(e);
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

  