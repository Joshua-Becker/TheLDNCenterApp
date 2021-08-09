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
import { set } from 'mobx';

export default function ChangeTeamScreen({ navigation }) {
  const {colors, isDark} = useTheme();
  useStatusBar();
  const [previousPharmacy, setPreviousPharmacy] = useState([]);
  const [previousProvider, setPreviousProvider] = useState([]);
  const [pharmacyListOpen, setPharmacyListOpen] = useState(false);
  const [pharmacyValue, setPharmacyValue] = useState(null);
  const [providerListOpen, setProviderListOpen] = useState(false);
  const [providerValue, setProviderValue] = useState(null);
  const [pharmacy, setPharmacy] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [pharmacyIdDict, setPharmacyIdDict] = useState({});
  const [provider, setProvider] = useState([]);
  const [providers, setProviders] = useState([]);
  const [providerIdDict, setProviderIdDict] = useState({});
  const user = {name: auth().currentUser.displayName, email: auth().currentUser.email, id: auth().currentUser.uid}
  const { ethree, auditLog } = useContext(AuthContext);
  
  async function getPreviousTeam(){
      const previousPharmacyRaw = await firestore()
      .collection('USERS')
      .doc(user.id)
      .get();
      const previousPharmacyData = previousPharmacyRaw.data();
      setPreviousPharmacy({name: previousPharmacyData.pharmacyName, id: previousPharmacyData.pharmacyID});
      const previousProviderData = previousPharmacyRaw.data();
      setPreviousProvider({name: previousProviderData.providerName, id: previousProviderData.providerID});
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
      let cancellingFunction = false;
      console.log(previousPharmacy.name,pharmacy.name,previousProvider.name,provider.name);
      if(previousPharmacy.id == pharmacy.id && previousProvider.id == provider.id) {
        Alert.alert(
          "Transferring Team",
          "You are already a member of this team. Please select another provider and/or pharmacy.",
          [
            { text: "Okay", onPress: () => {cancellingFunction = true} }
          ],
          { cancelable: false }
        );
        return;
      }
      if (Object.keys(pharmacy).length > 0 || Object.keys(provider).length > 0) {
        // console.log(previousPharmacy.id, pharmacy.id);
        console.log('User ID: ' + user.id);
        let group = await ethree.getGroup(user.id);
        let findUserIdentity = await ethree.findUsers(user.id);
        let findTeamIdentity;
        if(group == null){
          group = await ethree.loadGroup(user.id, findUserIdentity);
        }
        
        if(previousPharmacy.id == pharmacy.id){
          const existingPharmacy = await ethree.findUsers(previousPharmacy.id);
          await group.remove(existingPharmacy);
        }
        if(previousProvider.id == provider.id){
          const existingProvider = await ethree.findUsers(previousProvider.id);
          await group.remove(existingProvider);
        }

        if(Object.keys(pharmacy).length > 0){
          console.log('pharmacy: ', pharmacy.id);
          findTeamIdentity = await ethree.findUsers(pharmacy.id);
        }
        if(Object.keys(provider).length > 0){
          console.log('provider');
          findTeamIdentity = await ethree.findUsers(provider.id);
        }
        if(Object.keys(pharmacy).length > 0 && Object.keys(provider).length > 0) {
          console.log('pharmacy and provider');
          findTeamIdentity = await ethree.findUsers([pharmacy.id, provider.id]);
        }
        console.log(findTeamIdentity);
        await group.add(findTeamIdentity).catch((error)=>{console.log(error)});
        const encryptedEmail = await group.encrypt(user.email);
        const encryptedName = await group.encrypt(user.name);

        if(previousPharmacy.id == pharmacy.id){
          setPharmacy(previousPharmacy);
        }
        if(previousProvider.id == provider.id){
          setProvider(previousProvider);
        }
        await firestore()
        .collection('USERS')
        .doc(user.id)
        .set({
            pharmacyName: (pharmacy.name != undefined) ? pharmacy.name : '',
            pharmacyID: (pharmacy.id != undefined) ? pharmacy.id : '',
            providerName: (provider.name != undefined) ? provider.name : '',
            providerID: (provider.id != undefined) ? provider.id : '',
            user: {
              name: encryptedName,
              email: encryptedEmail,
            }
        }, { merge: true })
        .catch(function(error) {
            console.error("Error saving post : ", error);
        });

        await deleteMessages(firestore(), 50);
        if(previousPharmacy.id != pharmacy.id && pharmacy.id != undefined){
          await firestore()
          .collection('CAREGIVERS')
          .doc(pharmacy.id)
          .collection('PATIENTS')
          .doc(user.id)
          .set({
              joined: new Date().getTime(),
              status: 'pending',
              newPatient: true,
          }, { merge: true });
  
          await firestore()
          .collection('CAREGIVERS')
          .doc(previousPharmacy.id)
          .collection('PATIENTS')
          .doc(user.id)
          .delete();

          auditLog(user.id, 'Changed pharmacy');
        }
        if(previousProvider.id != provider.id && provider.id != undefined){
          await firestore()
          .collection('CAREGIVERS')
          .doc(provider.id)
          .collection('PATIENTS')
          .doc(user.id)
          .set({
              joined: new Date().getTime(),
              status: 'pending',
              newPatient: true,
          }, { merge: true });
  
          await firestore()
          .collection('CAREGIVERS')
          .doc(previousProvider.id)
          .collection('PATIENTS')
          .doc(user.id)
          .delete();

          auditLog(user.id, 'Changed provider');
        }


        navigation.navigate('Home');
      }
  }
  
  const getCaregivers = async () => {
    const snapshot = await firestore().collection('CAREGIVERS').get()
    const pharmacies = snapshot.docs.map(doc => ({data: doc.data(), id: doc.id}));
    var ret_pharmacies = [];
    var pharmacies_dict = {};
    var ret_providers = [];
    var providers_dict = {};
    pharmacies.forEach(createCaregiverObjects);
    function createCaregiverObjects(item) {
        if(item.data.type.toLowerCase() == 'pharmacy'){
            ret_pharmacies.push({label: item.data.name, value: item.data.name, icon: () => <Icon name="shield" size={18} color="#900" />, id: item.id})    
            pharmacies_dict[item.data.name] = item.id;
        }
        if(item.data.type.toLowerCase() == 'provider'){
            ret_providers.push({label: item.data.name, value: item.data.name, icon: () => <Icon name="plus" size={18} color="#900" />, id: item.id})    
            providers_dict[item.data.name] = item.id;
        }
    }
    setPharmacyIdDict(pharmacies_dict);
    setPharmacies(ret_pharmacies);
    setProviderIdDict(providers_dict);
    setProviders(ret_providers);
};

  useEffect(() => {
    getCaregivers();
    getPreviousTeam();
      Alert.alert(
          "Transferring Teams",
          "Are you sure you want to transfer pharmacies and/or providers?",
          [
            {
              text: "Cancel",
              onPress: () => navigation.navigate('TeamHome'),
              style: "cancel"
            },
            { text: "Yes", onPress: () => console.log("Yes Pressed") }
          ],
          { cancelable: false }
      );
  },[]);

  function toggleOpenPharmacy(){
    if(pharmacyListOpen == true){
      setPharmacyListOpen(false)
    }
    else{
      setPharmacyListOpen(true)
    }
}

function toggleOpenProvider(){
    if(providerListOpen == true){
      setProviderListOpen(false)
    }
    else{
      setProviderListOpen(true)
    }
}

return (
  <View style={styles(colors).rootContainer}>
    <View style={styles(colors).innerContainer}>
        <View style={styles(colors).dropDowns}>
            <View style={styles(colors).dropDownsPharmacy}>
                <DropDownPicker
                items={pharmacies}
                open={pharmacyListOpen}
                setOpen={toggleOpenPharmacy}
                value={pharmacyValue}
                setValue={setPharmacyValue}
                onChangeValue={item => {
                    setPharmacy({name: item, id: pharmacyIdDict[item]});
                }}
                // defaultValue={pharmacy.name}
                // containerStyle={{height: 60}}
                // style={{backgroundColor: colors.formBackground, width: '90%'}}
                // dropDownStyle={{backgroundColor: colors.formBackground, width: '90%'}}
                // onChangeItem={item => setPharmacy({name: item.value, id: item.id})}
                searchable={true}
                searchablePlaceholder="Search for a pharmacy"
                searchablePlaceholderTextColor="gray"
                seachableStyle={{}}
                searchableError={() => <Text>Not Found</Text>}
                placeholder={'Select a pharmacy'}
                />
            </View>
            <View style={styles(colors).dropDownsProvider}>
                <DropDownPicker
                items={providers}
                open={providerListOpen}
                setOpen={toggleOpenProvider}
                value={providerValue}
                setValue={setProviderValue}
                onChangeValue={item => {
                    setProvider({name: item, id: providerIdDict[item]});
                }}
                // defaultValue={pharmacy.name}
                // containerStyle={{height: 60}}
                // style={{backgroundColor: colors.formBackground, width: '90%'}}
                // dropDownStyle={{backgroundColor: colors.formBackground, width: '90%'}}
                // onChangeItem={item => setPharmacy({name: item.value, id: item.id})}
                searchable={true}
                searchablePlaceholder="Search for a provider"
                searchablePlaceholderTextColor="gray"
                seachableStyle={{}}
                searchableError={() => <Text>Not Found</Text>}
                placeholder={'Select a provider'}
                />
            </View>
        </View>
        <FormButton
        title='Join'
        modeValue='contained'
        labelStyle={styles(colors).buttonLabel}
        onPress={() => handleButtonPress()} 
        disabled={Object.keys(pharmacy).length === 0 && Object.keys(provider).length === 0}
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
  closeButtonContainer: {
      position: 'absolute',
      top: 30,
      right: 0,
      zIndex: 1
  },
  innerContainer: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      marginBottom: 20,
  },
  title: {
      fontSize: 24,
      marginBottom: 10
  },
  buttonLabel: {
      fontSize: 22,
      color: colors.buttonText,
  },
  dropDowns: {
      width: '90%',
  },
  dropDownsPharmacy: {
      marginTop: 20,
      marginBottom: 50,
      zIndex: 1,
  },
  dropDownsProvider: {
      marginBottom: 20,
      zIndex: 0,
  }
  });