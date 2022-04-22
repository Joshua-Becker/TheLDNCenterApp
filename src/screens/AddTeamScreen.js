import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Text, Linking} from 'react-native';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import useStatusBar from '../utils/useStatusBar';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';

export default function AddTeamScreen({navigation}) {
  const {colors, isDark} = useTheme();
  useStatusBar();
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
  const user = {
    name: auth().currentUser.displayName,
    email: auth().currentUser.email,
    id: auth().currentUser.uid,
  };
  const {ethree, auditLog} = useContext(AuthContext);

  async function handleButtonPress() {
    if (Object.keys(pharmacy).length > 0 || Object.keys(provider).length > 0) {
      //Must encrypt name and email again with pharmacy key
      let group = await ethree.getGroup(user.id);
      let findUserIdentity = await ethree.findUsers(user.id);
      if (group == null) {
        group = await ethree.loadGroup(user.id, findUserIdentity);
      }

      if (Object.keys(pharmacy).length > 0) {
        findUserIdentity = await ethree.findUsers(pharmacy.id);
      }
      if (Object.keys(provider).length > 0) {
        findUserIdentity = await ethree.findUsers(provider.id);
      }
      if (
        Object.keys(pharmacy).length > 0 &&
        Object.keys(provider).length > 0
      ) {
        findUserIdentity = await ethree.findUsers([pharmacy.id, provider.id]);
      }

      await group.add(findUserIdentity).catch((error) => {
        console.log(error);
      });
      const encryptedEmail = await group.encrypt(user.email);
      const encryptedName = await group.encrypt(user.name);

      await firestore()
        .collection('USERS')
        .doc(user.id)
        .set(
          {
            user: {
              name: encryptedName,
              email: encryptedEmail,
            },
            pharmacyName: pharmacy.name != undefined ? pharmacy.name : '',
            pharmacyID: pharmacy.id != undefined ? pharmacy.id : '',
            providerName: provider.name != undefined ? provider.name : '',
            providerID: provider.id != undefined ? provider.id : '',
          },
          {merge: true},
        )
        .catch(function (error) {
          console.error('Error saving post : ', error);
          //this code does not throw an error.
        });
      if (pharmacy.id != undefined) {
        await firestore()
          .collection('CAREGIVERS')
          .doc(pharmacy.id)
          .collection('PATIENTS')
          .doc(user.id)
          .set(
            {
              // userID: user.id,
              // email: user.email,
              // name: user.name,
              joined: new Date().getTime(),
              status: 'pending',
              newPatient: true,
            },
            {merge: true},
          );
        auditLog(user.id, 'Joined pharmacy');
      }
      if (provider.id != undefined) {
        await firestore()
          .collection('CAREGIVERS')
          .doc(provider.id)
          .collection('PATIENTS')
          .doc(user.id)
          .set(
            {
              // userID: user.id,
              // email: user.email,
              // name: user.name,
              joined: new Date().getTime(),
              status: 'pending',
              newPatient: true,
            },
            {merge: true},
          );
        auditLog(user.id, 'Joined provider');
      }
    }
    navigation.push('TeamHome');
  }

  const getCaregivers = async () => {
    const snapshot = await firestore().collection('CAREGIVERS').get();
    const pharmacies = snapshot.docs.map((doc) => ({
      data: doc.data(),
      id: doc.id,
    }));
    var ret_pharmacies = [];
    var pharmacies_dict = {};
    var ret_providers = [];
    var providers_dict = {};
    pharmacies.forEach(createCaregiverObjects);
    function createCaregiverObjects(item) {
      if (item.data.type.toLowerCase() == 'pharmacy') {
        ret_pharmacies.push({
          label: item.data.name,
          value: item.data.name,
          icon: () => <Icon name="shield" size={18} color="#900" />,
          id: item.id,
        });
        pharmacies_dict[item.data.name] = item.id;
      }
      if (item.data.type.toLowerCase() == 'provider') {
        ret_providers.push({
          label: item.data.name,
          value: item.data.name,
          icon: () => <Icon name="plus" size={18} color="#900" />,
          id: item.id,
        });
        providers_dict[item.data.name] = item.id;
      }
    }
    setPharmacyIdDict(pharmacies_dict);
    setPharmacies(ret_pharmacies);
    setProviderIdDict(providers_dict);
    setProviders(ret_providers);
  };

  function toggleOpenPharmacy() {
    if (pharmacyListOpen == true) {
      setPharmacyListOpen(false);
    } else {
      setPharmacyListOpen(true);
    }
  }

  function toggleOpenProvider() {
    if (providerListOpen == true) {
      setProviderListOpen(false);
    } else {
      setProviderListOpen(true);
    }
  }

  function currentValue() {
    console.log(pharmacy.name);
  }

  useEffect(() => {
    getCaregivers();
  }, []);

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
              onChangeValue={(item) => {
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
              onChangeValue={(item) => {
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
          <FormButton
            title="Find the right team for you"
            modeValue="contained"
            labelStyle={styles(colors).linkingButtonLabel}
            onPress={() =>
              Linking.openURL(
                'https://theldnhealthcenter.com/create-your-ldn-journey/',
              )
            }
            disabled={
              Object.keys(pharmacy).length === 0 &&
              Object.keys(provider).length === 0
            }
          />
        </View>
        <FormButton
          title="Join"
          modeValue="contained"
          labelStyle={styles(colors).buttonLabel}
          onPress={() => handleButtonPress()}
          disabled={
            Object.keys(pharmacy).length === 0 &&
            Object.keys(provider).length === 0
          }
        />
      </View>
    </View>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    closeButtonContainer: {
      position: 'absolute',
      top: 30,
      right: 0,
      zIndex: 1,
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
      marginBottom: 10,
    },
    buttonLabel: {
      fontSize: 22,
      color: colors.buttonText,
    },
    linkingButtonLabel: {
      fontSize: 15,
      color: colors.buttonText,
      zIndex: 0,
    },
    dropDowns: {
      width: '90%',
    },
    dropDownsPharmacy: {
      marginTop: 20,
      marginBottom: 20,
      zIndex: 2,
    },
    dropDownsProvider: {
      marginBottom: 20,
      zIndex: 1,
    },
  });
