import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    function addNewUser(newUser) {
        const currentUser = newUser.toJSON();
        firestore()
          .collection('USERS')
          .doc(currentUser.uid)
          .set({
            user: {
              _id: currentUser.uid,
              email: currentUser.email,
              name: currentUser.displayName,
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
          register: async (firstName, lastName, email, password) => {
            const username = firstName + ' ' + lastName;
            try {
              await auth().createUserWithEmailAndPassword(email, password);
              var newUser = auth().currentUser;
              newUser.updateProfile({
                displayName: username
              })
              addNewUser(newUser);
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
          }
        }}
      >
        {children}
      </AuthContext.Provider>
    );
};
  