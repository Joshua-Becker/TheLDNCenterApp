import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import useStatusBar from '../utils/useStatusBar';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';

export default function ChangePharmacyScreen({ navigation }) {
  const {colors, isDark} = useTheme();
  useStatusBar();
  const [pharmacy, setPharmacy] = useState([]);
  const [previousPharmacy, setPreviousPharmacy] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const user = {name: auth().currentUser.displayName, email: auth().currentUser.email, id: auth().currentUser.uid}
  const { ethree, auditLog } = useContext(AuthContext);
  
  async function getPreviousPharmacy(){
      const previousPharmacyRaw = await firestore()
      .collection('USERS')
      .doc(user.id)
      .get();
      const previousPharmacyData = previousPharmacyRaw.data()
      setPreviousPharmacy({name: previousPharmacyData.pharmacyName, id: previousPharmacyData.pharmacyID})
  }

  async function deleteMessages(db, batchSize) {
      const collectionRef = db.collection('USERS').doc(auth().currentUser.uid).collection('MESSAGES');
      const query = collectionRef.orderBy('__name__').limit(batchSize);
    
      return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
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

  async function handleButtonPress() {
      await getPreviousPharmacy()
      let cancellingFunction = false;
      if(previousPharmacy.name == pharmacy.name) {
        Alert.alert(
          "Transferring Pharmacies",
          "You are already a member of this pharmacy. Please select another.",
          [
            { text: "Okay", onPress: () => {cancellingFunction = true} }
          ],
          { cancelable: false }
        );
        if(cancellingFunction){
          return;
        }
      }
      if (Object.keys(pharmacy).length > 0) {
        const findUserIdentity = await ethree.findUsers(pharmacy.id);
        const encryptedEmail = await ethree.authEncrypt(user.email, findUserIdentity);
        const encryptedName = await ethree.authEncrypt(user.name, findUserIdentity);
        await firestore()
        .collection('USERS')
        .doc(user.id)
        .set({
            pharmacyName: pharmacy.name,
            pharmacyID: pharmacy.id,
        }, { merge: true })
        .catch(function(error) {
            console.error("Error saving post : ", error);
        });

        await deleteMessages(firestore(), 50)
        await firestore()
        .collection('PHARMACIES')
        .doc(pharmacy.id)
        .collection('PATIENTS')
        .doc(user.id)
        .set({
            joined: new Date().getTime(),
        }, { merge: true });

        await firestore()
        .collection('PHARMACIES')
        .doc(previousPharmacy.id)
        .collection('PATIENTS')
        .doc(user.id)
        .delete();

        auditLog(user.id, 'Changed pharmacy');
        navigation.navigate('PharmacyHome');
      }
  }
  
  const getPharmacies = async () => {
      const snapshot = await firestore().collection('PHARMACIES').get()
      const pharmacies = snapshot.docs.map(doc => ({data: doc.data(), id: doc.id}));
      var ret_pharmacies = [];
      pharmacies.forEach(createPharmacyObject);
      function createPharmacyObject(item) {
          ret_pharmacies.push({label: item.data.name, value: item.data.name, icon: () => <Icon name="shield" size={18} color="#900" />, id: item.id})    
      }
      setPharmacies(ret_pharmacies);
  };

  useEffect(() => {
      getPharmacies();
      Alert.alert(
          "Transferring Pharmacies",
          "Are you sure you want to transfer pharmacies?",
          [
            {
              text: "Cancel",
              onPress: () => navigation.navigate('PharmacyHome'),
              style: "cancel"
            },
            { text: "Yes", onPress: () => console.log("Yes Pressed") }
          ],
          { cancelable: false }
      );
  },[]);

  return (
    <View style={styles(colors).rootContainer}>
      <View style={styles(colors).innerContainer}>
        <DropDownPicker
          items={pharmacies}
          defaultValue={pharmacy.name}
          containerStyle={{height: 60}}
          style={{backgroundColor: colors.formBackground, width: '90%'}}
          dropDownStyle={{backgroundColor: colors.formBackground, width: '90%'}}
          onChangeItem={item => setPharmacy({name: item.value, id: item.id})}
          searchable={true}
          searchablePlaceholder="Search for an item"
          searchablePlaceholderTextColor="gray"
          seachableStyle={{}}
          searchableError={() => <Text>Not Found</Text>}
      />
        <FormButton
          title='Join'
          modeValue='contained'
          labelStyle={styles(colors).buttonLabel}
          onPress={() => handleButtonPress()}
          disabled={Object.keys(pharmacy).length === 0}
        />
      </View>
    </View>
  );
}

const styles = (colors) => StyleSheet.create({
rootContainer: {
    flex: 1,
    backgroundColor: colors.background,
},
innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 50,
},
buttonLabel: {
    fontSize: 22,
    color: colors.buttonText,
}
});