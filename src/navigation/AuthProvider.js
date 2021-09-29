import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { EThree } from '@virgilsecurity/e3kit-native';
import functions from '@react-native-firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});


export const AuthProvider = ({ fcmToken, children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [ethree, setEthree] = useState(null);
  const getToken = functions().httpsCallable('getVirgilJwt');
  const initializeFunction = () => getToken().then(result => result.data.token);
  const delay = ms => new Promise(res => setTimeout(res, ms));

  function getFormType(condition){
    return '';
  }

  function ethreeDerivedToStr(array) {
    let out = '';
    for (const num of array) {
      out += num.toString();
    }
    return out;
  }

  async function getCaregiversIDs(userID){
    const snapshot = await firestore()
    .collection('USERS')
    .doc(userID)
    .get();
    const data = snapshot.data();
    return {'pharmacy' : data.pharmacyID, 'provider': data.providerID};
  }

  async function auditLog(user_id, message){
    await firestore()
    .collection('AUDIT_LOG_USERS')
    .doc(user_id)
    .collection('LOGS')
    .add({
      timeStamp: new Date().getTime(),
      action: message,
    });
  }

  async function addNewUser(userExists, newUser, backupPassword, displayName = '', phoneNumber = '', condition = '', painLevel = '', symptomTimeline = '', medications = '', comments = '') {
    const currentUser = newUser.toJSON();
    let identityExists = false;
    EThree.initialize(initializeFunction, { AsyncStorage }).then(async eThree => {
      await eThree.cleanup().then(() => console.log('ethree cleanup success'))
      .catch(e => console.error('ethree cleanup error: ', e));
      setEthree(eThree);
      await eThree.register()
        .then(async () => {
          const group = await eThree.createGroup(currentUser.uid);
          const encryptedName = await group.encrypt(displayName);
          const encryptedEmail = await group.encrypt(currentUser.email);
          const formType = getFormType(condition);
          firestore()
          .collection('USERS')
          .doc(currentUser.uid)
          .set({
            user: {
              _id: currentUser.uid,
              email: encryptedEmail,
              name: encryptedName,
              phone: phoneNumber,
              condition: condition,
              painLevel: painLevel,
              symptomTimeline: symptomTimeline,
              medications: medications,
              comments: comments,
              token: fcmToken,
            },
            formType: formType,
            formInterval: 14,
            formReminders: 'on',
            note: 'Saved Data',
          });
        })
        .catch(async (e) => {
          const errorStr = e.toString();
          if(errorStr.includes('IdentityAlreadyExists')){
            identityExists = true;
          } else {
            console.error('EThree Register Error: ', e)
          }
        });
      if(identityExists){
        const caregiversIDs = await getCaregiversIDs(currentUser.uid);
        await eThree.resetPrivateKeyBackup()
        .then(async () =>{
          await eThree.rotatePrivateKey()
          .then(async () => {
            let group;
            group = await eThree.getGroup(currentUser.uid);
            const findUserIdentity = await eThree.findUsers(currentUser.uid);
            if(group == null){
              group = await eThree.loadGroup(currentUser.uid, findUserIdentity);
            }
            const encryptedName = await group.encrypt(currentUser.displayName);
            const encryptedEmail = await group.encrypt(currentUser.email);
            await deleteMessages(firestore(), 50);
            if(condition != ''){
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
                latestMessage: {
                  text: '',
                },
                note: 'Saved Data',
              }, { merge: true });
            }
            else {
              firestore()
              .collection('USERS')
              .doc(currentUser.uid)
              .set({
                user: {
                  email: encryptedEmail,
                  name: encryptedName,
                },
                latestMessage: {
                  text: '',
                },
                note: 'Saved Data',
              }, { merge: true });
            }
          });
        });
      }
      await eThree.backupPrivateKey(currentUser.uid) //backupPassword
      .then(()=>console.log('EThree backup success'))
      .catch(e => console.error('EThree backup private key error: ', e));
      auditLog(currentUser.uid, 'Successfully signed up');
    })
    .catch( err => {
      console.log('EThree Initialize fail:' + err);
    });
  }

  async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();
    
    process.nextTick = setImmediate;

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }
  
    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  
    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
    });
  }

  async function deleteMessages(db, batchSize) {
    const collectionRef = db.collection('USERS').doc(auth().currentUser.uid).collection('MESSAGES');
    const query = collectionRef.orderBy('__name__').limit(batchSize);
  
    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, resolve).catch(reject);
    });
  }

  function checkForNotifications(){
    firestore().collection('USERS').doc(user.uid).get()
    .then((doc) => {
      //console.log(doc.data());
      const data = doc.data();
      if(data.latestMessage != undefined && data.latestMessage.unreadMessage != null && data.latestMessage.unreadMessage != undefined){
        setNotifications((oldState) => ({...oldState, unreadMessage: data.latestMessage.unreadMessage}));
      } else {
        setNotifications((oldState) => ({...oldState, unreadMessage: false}));
      }
      if(data.latestMessage != undefined && data.latestMessage.unreadMessageFromProvider != null && data.latestMessage.unreadMessageFromProvider != undefined){
        setNotifications((oldState) => ({...oldState, unreadMessageFromProvider: data.latestMessage.unreadMessageFromProvider}));
      } else {
        setNotifications((oldState) => ({...oldState, unreadMessageFromProvider: false}));
      }
    }).catch((error) => {
      setNotifications((oldState) => ({...oldState, unreadMessage: false, unreadMessageFromProvider: false}));
      console.log('Error getting user notifications: ' + error);
    });
  }

  function setAdviceNotification(userId){
    firestore().collection('USERS').doc(userId).get().then((doc) => {
      const userInfo = doc.data();
      if(userInfo.pharmacyID != undefined){
        firestore()
        .collection('CAREGIVERS')
        .doc(userInfo.pharmacyID)
        .collection('PATIENTS')
        .doc(userId)
        .set({
          symptomAlert: true,
        }, { merge: true });
      }
      if(userInfo.providerID != undefined){
        firestore()
          .collection('CAREGIVERS')
          .doc(userInfo.providerID)
          .collection('PATIENTS')
          .doc(userId)
          .set({
              symptomAlert: true,
          }, { merge: true });
      }
    });
  }

  async function checkFomSubmission(userId){
    let formDataObj = { 
      'dates': [],
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
    const keys = Object.keys(formDataObj);
    await firestore().collection('USERS').doc(user.uid).collection('FORMS').orderBy('date', 'desc').get()
    .then((query) => {
      query.docs.map(doc => {
        const data = doc.data();
        for(key of keys){
          formDataObj[key].unshift(parseInt(data.symptoms[key]));
        }
      });
      if(formDataObj['dates'].length > 1){
        for(key of keys){
          if(key != 'dates'){
            if(Math.abs(formDataObj[key][formDataObj[key].length - 1] - formDataObj[key][formDataObj[key].length - 2]) >= 2){
              setAdviceNotification(userId);
            }
          }
        }
      }
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
        auditLog,
        login: async (email, password) => {
          let signedIn = false;
          try {
            let { loginPassword, backupPassword } = EThree.derivePasswords(password);
            //loginPassword = ethreeDerivedToStr(loginPassword);
            backupPassword = ethreeDerivedToStr(backupPassword);
            await auth().signInWithEmailAndPassword(email, password)
            .then( async (userCreds) => {
              await EThree.initialize(initializeFunction, { AsyncStorage }).then(async eThree => {
                setEthree(eThree);
                signedIn = true;
                setUser(userCreds.user);
                const hasLocalPrivateKey = await eThree.hasLocalPrivateKey();
                //backupPassword
                if (!hasLocalPrivateKey) await eThree.restorePrivateKey(userCreds.user.uid).catch(async (e) => {
                  // No private key and backup password does not work. Must be password reset
                  // Delete messages and create new private key with new password
                  addNewUser(true, userCreds.user, userCreds.user.uid); //backupPassword
                });
              auditLog(userCreds.user.uid, 'Successfully logged in');
              });
            })
            .catch( function(error) {
              console.log('Error occurred logging in: ' + error);
            });
          } catch (e) {
            console.log('Error occurred logging in (try catch): ' + e);
          }
          if(!signedIn){
            await AsyncAlert('Wrong username or password', 'Please try again');
            return false;
          }
          return true;
        },
        register: async (firstName, lastName, phoneNumber, email, password, condition, painLevel, symptomTimeline, medications, comments) => {
          const username = firstName + ' ' + lastName;
          if(firstName == '' || lastName == '' || phoneNumber == '' || email == '' || password == '' || condition == '' || symptomTimeline == '') {
            alert("Please make sure the following fields are not empty: name, email, phone number, password, condition, symptom timeline");
            return;
          }
          try {
            console.log('Creating firebase user');
            let { loginPassword, backupPassword } = EThree.derivePasswords(password);
            //loginPassword = ethreeDerivedToStr(loginPassword);
            backupPassword = ethreeDerivedToStr(backupPassword);
            await auth().createUserWithEmailAndPassword(email, password).then(function(user) {
              var user = auth().currentUser;
              user.updateProfile({
                  displayName: username
              }).then( async function() {
                  setUser(user);
                  addNewUser(false, user, backupPassword, username, phoneNumber, condition, painLevel, symptomTimeline, medications, comments);
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
            if(typeof ethree !== 'undefined') await ethree.cleanup();
          } catch (e) {
            console.error('Error removing private key:' + e);
          }
          try {
            var user = auth().currentUser;
            auditLog(user.uid, 'Logging out');
            await auth().signOut();
          } catch (e) {
            console.error('Error signing out:' + e);
          }
        },
        submitForm: async (symptoms, comments) => {
          var user = auth().currentUser;
          const caregiversIDs = await getCaregiversIDs(user.uid);
          firestore()
          .collection('USERS')
          .doc(user.uid)
          .collection('FORMS')
          .add({
            symptoms: symptoms,
            comments: comments,
            date: new Date().getTime(),
          }).then((data)=> {          
            checkFomSubmission(user.uid);
          });
          firestore().collection('CAREGIVERS').doc(caregiversIDs.pharmacy).collection('PATIENTS').doc(user.uid)
          .set({
            newForm: true,
          }, { merge: true });
          auditLog(user.uid, 'Submitted form');
        },
        forgotPassword: async (email) => {
          await auth().sendPasswordResetEmail(email);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

