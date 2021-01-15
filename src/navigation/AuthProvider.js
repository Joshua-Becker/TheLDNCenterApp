import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext({});

export const AuthProvider = ({ fcmToken, children }) => {
    const [user, setUser] = useState(null);

    function addNewUser(newUser, condition) {
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
            token: fcmToken,
          },
          note: 'Saved Data',
      });
    }

    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
          login: async (email, password) => {
            try {
              await auth().signInWithEmailAndPassword(email, password);
            } catch (e) {
              console.log(e);
            }
          },
          register: async (firstName, lastName, email, password, condition) => {
            const username = firstName + ' ' + lastName;
            try {
              await auth().createUserWithEmailAndPassword(email, password).then(function(user) {
                var user = auth().currentUser;
                user.updateProfile({
                    displayName: username
                }).then(function() {
                    const newUser = auth().currentUser
                    addNewUser(newUser, condition)
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
          submitForm: async (painLevel) => {
            var user = auth().currentUser
            firestore()
            .collection('USERS')
            .doc(user.uid)
            .collection('FORMS')
            .add({
              pain: painLevel,
              date: new Date().getTime(),
            });
          }
        }}
      >
        {children}
      </AuthContext.Provider>
    );
};
  