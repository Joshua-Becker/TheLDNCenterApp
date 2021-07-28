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


  function ethreeDerivedToStr(array) {
    let out = '';
    for (const num of array) {
      out += num.toString();
    }
    return out;
  }

  async function getPharmacyID(userID){
    const snapshot = await firestore()
    .collection('USERS')
    .doc(userID)
    .get();
    const data = snapshot.data();
    return data.pharmacyID;
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
        const pharmacyID = await getPharmacyID(currentUser.uid);
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
          }
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
          const pharmacyID = await getPharmacyID(user.uid);
          firestore()
          .collection('USERS')
          .doc(user.uid)
          .collection('FORMS')
          .add({
            symptoms: symptoms,
            comments: comments,
            date: new Date().getTime(),
          });
          firestore().collection('PHARMACIES').doc(pharmacyID).collection('PATIENTS').doc(user.uid)
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

