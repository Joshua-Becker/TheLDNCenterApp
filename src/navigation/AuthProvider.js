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

  async function addNewUser(newUser, condition, painLevel, symptomTimeline, medications, comments) {
    const currentUser = newUser.toJSON();
    firestore()
      .collection('USERS')
      .doc(currentUser.uid)
      .set({
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName,
          condition: condition,
          painLevel: painLevel,
          symptomTimeline: symptomTimeline,
          medications: medications,
          comments: comments,
          token: fcmToken,
        },
        note: 'Saved Data',
    });
    EThree.initialize(initializeFunction, { AsyncStorage }).then(async eThree => {
      await eThree.cleanup();
      await eThree.register()
        .then(() => console.log('EThree Register Success'))
        .catch(e => console.error('EThree Register Error: ', e));
      setEthree(eThree);
    })
    .catch( err => {
      console.log('EThree register fail:' + err);
    })
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
          const username = firstName + ' ' + lastName;
          if(firstName == '' || lastName == '' || email == '' || password == '' || condition == '' || symptomTimeline == '') {
            alert("Please make sure the following fields are not empty: name, email, password, condition, symptom timeline");
            return;
          }
          try {
            await auth().createUserWithEmailAndPassword(email, password).then(function(user) {
              var user = auth().currentUser;
              user.updateProfile({
                  displayName: username
              }).then(function() {
                  const newUser = auth().currentUser;
                  addNewUser(newUser, condition, painLevel, symptomTimeline, medications, comments)
              }, function(error) {
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

  