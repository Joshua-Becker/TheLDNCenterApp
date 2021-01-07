import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import useStatsBar from '../utils/useStatusBar';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';


export default function AddRoomScreen({ navigation }) {
    useStatsBar('dark-content');
    const [pharmacy, setPharmacy] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const user = {name: auth().currentUser.displayName, email: auth().currentUser.email, id: auth().currentUser.uid}
    // ... Firestore query will come here later

    function handleButtonPress() {
        if (Object.keys(pharmacy).length > 0) {
            firestore()
            .collection('USERS')
            .doc(user.id)
            .set({
                pharmacyName: pharmacy.name,
                pharmacyID: pharmacy.id,
                latestMessage: {
                text: `You are now messaging ${pharmacy.name}.`,
                createdAt: new Date().getTime()
                }
            }, { merge: true })
            .catch(function(error) {
                console.error("Error saving post : ", error);
                //this code does not throw an error.
            });

            firestore()
            .collection('USERS')
            .doc(auth().currentUser.uid)
            .collection('MESSAGES')
            .add({
                text: `You are now messaging ${pharmacy.name}.`,
                createdAt: new Date().getTime(),
                system: true
            });

            firestore()
            .collection('PHARMACIES')
            .doc(pharmacy.id)
            .collection('PATIENTS')
            .doc(user.id)
            .set({
                userID: user.id,
                email: user.email,
                name: user.name,
                joined: new Date().getTime(),
            }, { merge: true });
            navigation.navigate('Home');
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
    },[]);

    return (
      <View style={styles.rootContainer}>
        <View style={styles.closeButtonContainer}>
          <IconButton
            icon='close-circle'
            size={36}
            color='#6646ee'
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.innerContainer}>
          <Title style={styles.title}>Choose your Pharmacy</Title>
          <DropDownPicker
            items={pharmacies}
            defaultValue={pharmacy.name}
            containerStyle={{height: 60}}
            style={{backgroundColor: '#fafafa', width: '90%'}}
            dropDownStyle={{backgroundColor: '#fafafa', width: '90%'}}
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
            labelStyle={styles.buttonLabel}
            onPress={() => handleButtonPress()}
            disabled={Object.keys(pharmacy).length === 0}
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
rootContainer: {
    flex: 1
},
closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1
},
innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
},
title: {
    fontSize: 24,
    marginBottom: 10
},
buttonLabel: {
    fontSize: 22
}
});