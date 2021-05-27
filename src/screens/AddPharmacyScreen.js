import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import useStatusBar from '../utils/useStatusBar';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';

export default function AddPharmacyScreen({ navigation }) {
    const {colors, isDark} = useTheme();
    useStatusBar();
    const [pharmacy, setPharmacy] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const user = {name: auth().currentUser.displayName, email: auth().currentUser.email, id: auth().currentUser.uid}
    const { ethree, auditLog } = useContext(AuthContext);

    async function handleButtonPress() {
        if (Object.keys(pharmacy).length > 0) {
            //Must encrypt name and email again with pharmacy key

            const groupId = user.id;
            const group = await ethree.getGroup(groupId);
            const findUserIdentity = await ethree.findUsers(pharmacy.id);
            await group.add(findUserIdentity);
            const encryptedEmail = await group.encrypt(user.email);
            const encryptedName = await group.encrypt(user.name);

            await firestore()
            .collection('USERS')
            .doc(user.id)
            .set({
                user : {
                    name: encryptedName,
                    email: encryptedEmail,
                },
                pharmacyName: pharmacy.name,
                pharmacyID: pharmacy.id,
            }, { merge: true })
            .catch(function(error) {
                console.error("Error saving post : ", error);
                //this code does not throw an error.
            });

            await firestore()
            .collection('PHARMACIES')
            .doc(pharmacy.id)
            .collection('PATIENTS')
            .doc(user.id)
            .set({
                // userID: user.id,
                // email: user.email,
                // name: user.name,
                joined: new Date().getTime(),
            }, { merge: true });

            auditLog(user.id, 'Joined pharmacy');
        }
        navigation.navigate('My Pharmacy');
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
            searchablePlaceholder="Search for a pharmacy"
            searchablePlaceholderTextColor="gray"
            seachableStyle={{}}
            searchableError={() => <Text>Not Found</Text>}
            placeholder={'Select a pharmacy'}
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
}
});